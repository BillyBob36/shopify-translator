/**
 * Processeur de batch pour traduction CSV
 * Gere la deduplication, le batching par minute, et l'application des traductions
 */

import { OpenAIClient } from './openaiClient';
import { MinuteRateLimiter } from './rateLimiter';
import { calculateOptimalBatchSize, countTokens } from './tokenizer';
import { getPromptForLanguage, getLanguageInfo } from './prompts';

export class BatchProcessor {
  constructor(apiKey, config = {}) {
    this.apiKey = apiKey;
    this.config = {
      maxRPM: config.maxRPM || 4900,
      maxTPM: config.maxTPM || 3500000,
      targetLangCode: config.targetLangCode || 'fr',
      temperature: config.temperature || 0.3,
      startRow: config.startRow || 2,
      rowLimit: config.rowLimit || 0,
      saveEveryNRows: config.saveEveryNRows || 500,
      sourceColumn: config.sourceColumn || '',
      destColumn: config.destColumn || '',
      ...config
    };
    
    this.client = new OpenAIClient(apiKey, { temperature: this.config.temperature });
    this.rateLimiter = new MinuteRateLimiter({
      maxRPM: this.config.maxRPM,
      maxTPM: this.config.maxTPM
    });
    
    this.aborted = false;
    this.logs = [];
    
    // Dictionnaire de traductions (deduplication)
    this.translations = new Map();
    this.textLocations = new Map(); // text -> [{row, column}]
  }

  /**
   * Analyse le CSV et extrait les textes uniques
   */
  analyzeCSV(data) {
    const { startRow, rowLimit, sourceColumn } = this.config;
    const startIndex = startRow - 1;
    const endIndex = rowLimit > 0 ? Math.min(startIndex + rowLimit, data.length) : data.length;
    
    this.translations.clear();
    this.textLocations.clear();
    
    let totalCells = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
      const text = data[i][sourceColumn];
      if (text && text.trim()) {
        totalCells++;
        
        if (!this.textLocations.has(text)) {
          this.textLocations.set(text, []);
        }
        this.textLocations.get(text).push({ row: i, column: sourceColumn });
      }
    }
    
    const uniqueTexts = Array.from(this.textLocations.keys());
    const duplicatesCount = totalCells - uniqueTexts.length;
    
    this.log(`Analyse: ${totalCells} cellules, ${uniqueTexts.length} uniques, ${duplicatesCount} doublons (${Math.round(duplicatesCount/totalCells*100)}% economie)`);
    
    return {
      totalCells,
      uniqueTexts,
      duplicatesCount,
      savingsPercent: totalCells > 0 ? Math.round((duplicatesCount / totalCells) * 100) : 0
    };
  }

  /**
   * Construit le prompt pour un texte
   */
  buildPrompt(text) {
    const promptTemplate = getPromptForLanguage(this.config.targetLangCode);
    return promptTemplate.replace('{text}', text);
  }

  /**
   * Traite le CSV complet
   */
  async processCSV(data, onProgress, onPartialSave = null) {
    this.aborted = false;
    this.rateLimiter.reset();
    
    // Phase 1: Analyse
    const analysis = this.analyzeCSV(data);
    const { uniqueTexts } = analysis;
    
    if (uniqueTexts.length === 0) {
      this.log('Aucun texte a traduire');
      return data;
    }
    
    const promptTemplate = getPromptForLanguage(this.config.targetLangCode);
    const langInfo = getLanguageInfo(this.config.targetLangCode);
    
    this.log(`Traduction vers ${langInfo.name} (${uniqueTexts.length} textes uniques)`);
    
    let processedCount = 0;
    let remainingTexts = [...uniqueTexts];
    
    // Phase 2: Traitement par batches de minute
    while (remainingTexts.length > 0 && !this.aborted) {
      // Calculer la taille optimale du batch
      const batchInfo = calculateOptimalBatchSize(
        remainingTexts,
        promptTemplate,
        this.config.targetLangCode,
        this.config.maxTPM,
        this.config.maxRPM
      );
      
      if (batchInfo.batchSize === 0) {
        this.log('Erreur: impossible de calculer un batch valide');
        break;
      }
      
      const batchTexts = batchInfo.texts;
      this.log(`Batch: ${batchTexts.length} textes, ~${batchInfo.estimatedTokens} tokens estimes`);
      
      // Verifier si on peut envoyer
      if (!this.rateLimiter.canSendBatch(batchTexts.length, batchInfo.estimatedTokens)) {
        await this.rateLimiter.waitForNextMinute();
      }
      
      // Construire les prompts
      const prompts = batchTexts.map(text => this.buildPrompt(text));
      
      // Envoyer le batch
      const { results, stats } = await this.client.translateBatch(prompts, (progress) => {
        // Progression intra-batch
        if (onProgress) {
          onProgress({
            phase: 'translating',
            currentBatch: this.rateLimiter.totalMinutes,
            batchProgress: progress.percent,
            totalProcessed: processedCount + progress.completed,
            totalUnique: uniqueTexts.length,
            totalCells: analysis.totalCells,
            duplicatesSaved: analysis.duplicatesCount,
            savingsPercent: analysis.savingsPercent,
            rateLimitStats: this.rateLimiter.getStats(),
            percentage: Math.round(((processedCount + progress.completed) / uniqueTexts.length) * 100)
          });
        }
      });
      
      // Enregistrer les traductions
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const originalText = batchTexts[i];
        
        if (result.success) {
          this.translations.set(originalText, result.text);
        } else {
          this.log(`Echec traduction: "${originalText.substring(0, 50)}..." - ${result.error}`);
          // Garder le texte original en cas d'erreur
          this.translations.set(originalText, originalText);
        }
      }
      
      // Mettre a jour les compteurs
      this.rateLimiter.recordBatch(batchTexts.length, stats.tokensUsed);
      processedCount += batchTexts.length;
      remainingTexts = remainingTexts.slice(batchTexts.length);
      
      // Progression globale
      if (onProgress) {
        onProgress({
          phase: 'batch_complete',
          currentBatch: this.rateLimiter.totalMinutes,
          totalProcessed: processedCount,
          totalUnique: uniqueTexts.length,
          totalCells: analysis.totalCells,
          duplicatesSaved: analysis.duplicatesCount,
          savingsPercent: analysis.savingsPercent,
          rateLimitStats: this.rateLimiter.getStats(),
          percentage: Math.round((processedCount / uniqueTexts.length) * 100),
          remainingTexts: remainingTexts.length
        });
      }
      
      // Sauvegarde partielle
      if (onPartialSave && processedCount % this.config.saveEveryNRows < batchTexts.length) {
        const partialResult = this.applyTranslations(data);
        onPartialSave(partialResult, processedCount);
      }
      
      // Attendre la fin de la minute si d'autres batches restent
      if (remainingTexts.length > 0 && !this.aborted) {
        const timeRemaining = this.rateLimiter.getTimeUntilNextMinute();
        if (timeRemaining > 0) {
          this.log(`Attente ${Math.ceil(timeRemaining/1000)}s avant prochain batch...`);
          
          if (onProgress) {
            onProgress({
              phase: 'waiting',
              waitingSeconds: Math.ceil(timeRemaining / 1000),
              totalProcessed: processedCount,
              totalUnique: uniqueTexts.length,
              percentage: Math.round((processedCount / uniqueTexts.length) * 100)
            });
          }
          
          await this.rateLimiter.waitForNextMinute();
        }
      }
    }
    
    if (this.aborted) {
      this.log('Traitement interrompu par utilisateur');
      const partialResult = this.applyTranslations(data);
      if (onPartialSave) {
        onPartialSave(partialResult, processedCount);
      }
      throw new Error('Traitement annule');
    }
    
    // Phase 3: Appliquer les traductions
    this.log(`Traitement termine: ${processedCount} textes traduits`);
    return this.applyTranslations(data);
  }

  /**
   * Applique les traductions au CSV
   */
  applyTranslations(data) {
    const { destColumn } = this.config;
    const result = data.map(row => ({ ...row }));
    
    for (const [originalText, locations] of this.textLocations) {
      const translation = this.translations.get(originalText);
      if (translation) {
        for (const { row } of locations) {
          result[row][destColumn] = translation;
        }
      }
    }
    
    return result;
  }

  /**
   * Interrompt le traitement
   */
  abort() {
    this.aborted = true;
    this.log('Interruption demandee...');
  }

  /**
   * Ajoute un log
   */
  log(message) {
    const timestamp = new Date().toISOString().substr(11, 8);
    const entry = `[${timestamp}] ${message}`;
    this.logs.push(entry);
    console.log(`[BatchProcessor] ${entry}`);
    
    if (this.logs.length > 200) {
      this.logs.shift();
    }
  }

  /**
   * Recupere tous les logs
   */
  getAllLogs() {
    return [
      ...this.logs,
      ...this.rateLimiter.getLogs(),
      ...this.client.getLogs()
    ].sort();
  }
}
