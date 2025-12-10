/**
 * Service de tokenisation utilisant gpt-tokenizer (cl100k_base)
 * Pour comptage exact des tokens avant envoi a l'API
 */

import { encode } from 'gpt-tokenizer';
import { getCharsPerToken } from './prompts';

/**
 * Compte le nombre exact de tokens dans un texte
 */
export function countTokens(text) {
  if (!text) return 0;
  try {
    return encode(text).length;
  } catch (e) {
    // Fallback: estimation basee sur les caracteres
    return Math.ceil(text.length / 4);
  }
}

/**
 * Compte les tokens pour un prompt complet (system + user message)
 */
export function countPromptTokens(systemPrompt, userText) {
  // Overhead pour le format chat: ~4 tokens par message
  const messageOverhead = 8;
  return countTokens(systemPrompt) + countTokens(userText) + messageOverhead;
}

/**
 * Estime les tokens de sortie bases sur le texte source et la langue cible
 */
export function estimateOutputTokens(sourceText, targetLangCode) {
  if (!sourceText) return 0;
  const sourceChars = sourceText.length;
  const targetCharsPerToken = getCharsPerToken(targetLangCode);
  // La traduction a generalement une longueur similaire en caracteres
  // On ajoute 10% de marge
  return Math.ceil((sourceChars / targetCharsPerToken) * 1.1);
}

/**
 * Calcule le cout total en tokens pour une requete
 */
export function calculateRequestTokens(promptTemplate, sourceText, targetLangCode) {
  // Remplacer {text} par le texte source dans le prompt
  const fullPrompt = promptTemplate.replace('{text}', sourceText);
  const inputTokens = countTokens(fullPrompt);
  const outputTokens = estimateOutputTokens(sourceText, targetLangCode);
  
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens
  };
}

/**
 * Analyse un batch de textes et calcule les tokens totaux
 */
export function analyzeBatchTokens(texts, promptTemplate, targetLangCode) {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  
  const details = texts.map(text => {
    const { inputTokens, outputTokens, totalTokens } = calculateRequestTokens(
      promptTemplate, 
      text, 
      targetLangCode
    );
    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;
    return { text, inputTokens, outputTokens, totalTokens };
  });
  
  return {
    count: texts.length,
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    details
  };
}

/**
 * Determine la taille optimale du batch pour respecter la limite TPM
 * @param {Array} texts - Textes a traiter
 * @param {string} promptTemplate - Template du prompt
 * @param {string} targetLangCode - Code langue cible
 * @param {number} maxTPM - Limite de tokens par minute (default 3.5M)
 * @param {number} maxRPM - Limite de requetes par minute (default 4900)
 * @returns {Object} - { batchSize, estimatedTokens, texts }
 */
export function calculateOptimalBatchSize(texts, promptTemplate, targetLangCode, maxTPM = 3500000, maxRPM = 4900) {
  if (texts.length === 0) return { batchSize: 0, estimatedTokens: 0, texts: [] };
  
  let batchSize = Math.min(texts.length, maxRPM);
  let estimatedTokens = 0;
  
  // Reduire la taille du batch jusqu'a respecter la limite TPM
  while (batchSize > 0) {
    const batchTexts = texts.slice(0, batchSize);
    const analysis = analyzeBatchTokens(batchTexts, promptTemplate, targetLangCode);
    estimatedTokens = analysis.totalTokens;
    
    if (estimatedTokens <= maxTPM) {
      return {
        batchSize,
        estimatedTokens,
        texts: batchTexts,
        inputTokens: analysis.totalInputTokens,
        outputTokens: analysis.totalOutputTokens
      };
    }
    
    // Reduire de 10%
    batchSize = Math.floor(batchSize * 0.9);
  }
  
  // Fallback: au moins 1 requete
  const singleAnalysis = calculateRequestTokens(promptTemplate, texts[0], targetLangCode);
  return {
    batchSize: 1,
    estimatedTokens: singleAnalysis.totalTokens,
    texts: [texts[0]],
    inputTokens: singleAnalysis.inputTokens,
    outputTokens: singleAnalysis.outputTokens
  };
}

/**
 * Analyse complete d'un CSV pour estimation des couts
 */
export function analyzeCSVTokens(data, columnName, promptTemplate, targetLangCode, startRow = 2, rowLimit = 0) {
  const startIndex = startRow - 1;
  const endIndex = rowLimit > 0 ? Math.min(startIndex + rowLimit, data.length) : data.length;
  
  // Extraire les textes uniques
  const textMap = new Map();
  let totalCells = 0;
  
  for (let i = startIndex; i < endIndex; i++) {
    const text = data[i][columnName];
    if (text && text.trim()) {
      totalCells++;
      if (!textMap.has(text)) {
        textMap.set(text, 1);
      } else {
        textMap.set(text, textMap.get(text) + 1);
      }
    }
  }
  
  const uniqueTexts = Array.from(textMap.keys());
  const duplicatesCount = totalCells - uniqueTexts.length;
  
  // Analyser les tokens pour les textes uniques
  const analysis = analyzeBatchTokens(uniqueTexts, promptTemplate, targetLangCode);
  
  // Calculer le nombre de batches necessaires
  const { batchSize } = calculateOptimalBatchSize(uniqueTexts, promptTemplate, targetLangCode);
  const estimatedBatches = Math.ceil(uniqueTexts.length / Math.max(batchSize, 1));
  const estimatedMinutes = estimatedBatches; // 1 batch par minute max
  
  return {
    totalCells,
    uniqueTexts: uniqueTexts.length,
    duplicatesCount,
    savingsPercent: totalCells > 0 ? Math.round((duplicatesCount / totalCells) * 100) : 0,
    totalInputTokens: analysis.totalInputTokens,
    totalOutputTokens: analysis.totalOutputTokens,
    totalTokens: analysis.totalTokens,
    estimatedBatches,
    estimatedMinutes,
    estimatedApiCalls: uniqueTexts.length
  };
}
