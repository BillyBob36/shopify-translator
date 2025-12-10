/**
 * Client OpenAI pour les appels API
 * Gere les appels paralleles avec concurrence limitee pour eviter ERR_INSUFFICIENT_RESOURCES
 */

// Nombre max de requetes simultanees (limite navigateur)
const MAX_CONCURRENT = 400;

export class OpenAIClient {
  constructor(apiKey, config = {}) {
    this.apiKey = apiKey;
    this.model = config.model || 'gpt-4.1-mini';
    this.temperature = config.temperature || 0.3;
    this.maxConcurrent = config.maxConcurrent || MAX_CONCURRENT;
    this.logs = [];
  }

  /**
   * Appel API unique avec retry
   */
  async translate(prompt, temperature = null, retries = 2) {
    const temp = temperature ?? this.temperature;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: temp
          })
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const errorMsg = error.error?.message || response.statusText;
          
          // Retry sur erreur 429 (rate limit) ou 5xx
          if ((response.status === 429 || response.status >= 500) && attempt < retries) {
            const waitTime = Math.pow(2, attempt) * 1000; // Backoff exponentiel
            this.log(`Retry ${attempt + 1}/${retries} apres ${waitTime}ms (${response.status})`);
            await new Promise(r => setTimeout(r, waitTime));
            continue;
          }
          
          throw new Error(`API Error ${response.status}: ${errorMsg}`);
        }

        const data = await response.json();
        return {
          text: data.choices[0]?.message?.content || '',
          usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
        };
      } catch (error) {
        // Retry sur erreur reseau
        if (error.message.includes('fetch') && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 500;
          this.log(`Retry ${attempt + 1}/${retries} apres ${waitTime}ms (network error)`);
          await new Promise(r => setTimeout(r, waitTime));
          continue;
        }
        throw error;
      }
    }
  }

  /**
   * Execute des promesses avec concurrence limitee
   */
  async executeWithConcurrency(tasks, maxConcurrent, onProgress) {
    const results = new Array(tasks.length);
    let completed = 0;
    let totalTokensUsed = 0;
    let index = 0;
    
    const executeNext = async () => {
      while (index < tasks.length) {
        const currentIndex = index++;
        const task = tasks[currentIndex];
        
        try {
          const result = await task();
          results[currentIndex] = result;
          if (result.success) {
            totalTokensUsed += result.usage?.total_tokens || 0;
          }
        } catch (error) {
          results[currentIndex] = { success: false, error: error.message, index: currentIndex };
        }
        
        completed++;
        if (onProgress && completed % 10 === 0) { // Update tous les 10
          onProgress({
            completed,
            total: tasks.length,
            percent: Math.round((completed / tasks.length) * 100),
            tokensUsed: totalTokensUsed
          });
        }
      }
    };
    
    // Lancer maxConcurrent workers en parallele
    const workers = [];
    for (let i = 0; i < Math.min(maxConcurrent, tasks.length); i++) {
      workers.push(executeNext());
    }
    
    await Promise.all(workers);
    
    // Dernier update
    if (onProgress) {
      onProgress({
        completed: tasks.length,
        total: tasks.length,
        percent: 100,
        tokensUsed: totalTokensUsed
      });
    }
    
    return { results, totalTokensUsed };
  }

  /**
   * Appels API en parallele avec concurrence limitee
   * @param {Array} prompts - Liste des prompts a envoyer
   * @param {Function} onProgress - Callback de progression (optional)
   * @returns {Object} - { results, stats }
   */
  async translateBatch(prompts, onProgress = null) {
    const startTime = Date.now();
    const total = prompts.length;
    
    this.log(`Envoi de ${total} requetes (max ${this.maxConcurrent} simultanées)...`);

    // Creer les taches
    const tasks = prompts.map((prompt, idx) => async () => {
      try {
        const result = await this.translate(prompt);
        return { success: true, text: result.text, usage: result.usage, index: idx };
      } catch (error) {
        this.log(`Erreur requete ${idx}: ${error.message}`);
        return { success: false, error: error.message, index: idx };
      }
    });

    // Executer avec concurrence limitee
    const { results, totalTokensUsed } = await this.executeWithConcurrency(
      tasks, 
      this.maxConcurrent, 
      onProgress
    );

    const elapsed = Date.now() - startTime;
    const successCount = results.filter(r => r?.success).length;
    const errorCount = results.filter(r => r && !r.success).length;
    
    this.log(`Batch termine: ${successCount}/${total} succes, ${errorCount} erreurs, ${elapsed}ms, ${totalTokensUsed} tokens`);

    return {
      results,
      stats: {
        total,
        success: successCount,
        errors: errorCount,
        elapsed,
        tokensUsed: totalTokensUsed
      }
    };
  }

  /**
   * Ajoute un log
   */
  log(message) {
    const timestamp = new Date().toISOString().substr(11, 8);
    const entry = `[${timestamp}] ${message}`;
    this.logs.push(entry);
    console.log(`[OpenAI] ${entry}`);
    
    if (this.logs.length > 200) {
      this.logs.shift();
    }
  }

  /**
   * Recupere les logs
   */
  getLogs() {
    return [...this.logs];
  }
}
