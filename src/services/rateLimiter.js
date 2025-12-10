/**
 * Rate Limiter pour gerer les limites OpenAI par minute
 * - 4900 RPM (marge sur 5000)
 * - 3.5M TPM (marge sur 4M)
 */

export class MinuteRateLimiter {
  constructor(config = {}) {
    this.maxRPM = config.maxRPM || 4900;
    this.maxTPM = config.maxTPM || 3500000;
    
    // Stats de la minute courante
    this.minuteStart = null;
    this.requestsThisMinute = 0;
    this.tokensThisMinute = 0;
    
    // Stats globales
    this.totalRequests = 0;
    this.totalTokens = 0;
    this.totalMinutes = 0;
    
    // Logs
    this.logs = [];
  }

  /**
   * Demarre une nouvelle minute
   */
  startNewMinute() {
    this.minuteStart = Date.now();
    this.requestsThisMinute = 0;
    this.tokensThisMinute = 0;
    this.totalMinutes++;
    this.log(`Minute ${this.totalMinutes} demarree`);
  }

  /**
   * Verifie si on peut envoyer un batch
   */
  canSendBatch(requestCount, estimatedTokens) {
    if (!this.minuteStart) {
      this.startNewMinute();
      return true;
    }
    
    const elapsed = Date.now() - this.minuteStart;
    const isNewMinute = elapsed >= 60000;
    
    if (isNewMinute) {
      this.startNewMinute();
      return true;
    }
    
    // Verifier les limites
    const wouldExceedRPM = (this.requestsThisMinute + requestCount) > this.maxRPM;
    const wouldExceedTPM = (this.tokensThisMinute + estimatedTokens) > this.maxTPM;
    
    if (wouldExceedRPM) {
      this.log(`RPM limit: ${this.requestsThisMinute}+${requestCount} > ${this.maxRPM}`);
    }
    if (wouldExceedTPM) {
      this.log(`TPM limit: ${this.tokensThisMinute}+${estimatedTokens} > ${this.maxTPM}`);
    }
    
    return !wouldExceedRPM && !wouldExceedTPM;
  }

  /**
   * Enregistre un batch envoye
   */
  recordBatch(requestCount, tokensUsed) {
    this.requestsThisMinute += requestCount;
    this.tokensThisMinute += tokensUsed;
    this.totalRequests += requestCount;
    this.totalTokens += tokensUsed;
    
    this.log(`Batch: ${requestCount} req, ${tokensUsed} tokens (minute: ${this.requestsThisMinute}/${this.maxRPM} RPM, ${this.tokensThisMinute}/${this.maxTPM} TPM)`);
  }

  /**
   * Temps restant avant la prochaine minute
   */
  getTimeUntilNextMinute() {
    if (!this.minuteStart) return 0;
    const elapsed = Date.now() - this.minuteStart;
    return Math.max(0, 60000 - elapsed);
  }

  /**
   * Attend la fin de la minute courante
   */
  async waitForNextMinute() {
    const waitTime = this.getTimeUntilNextMinute();
    if (waitTime > 0) {
      this.log(`Attente de ${Math.ceil(waitTime/1000)}s avant prochaine minute...`);
      await new Promise(resolve => setTimeout(resolve, waitTime + 100)); // +100ms marge
    }
    this.startNewMinute();
  }

  /**
   * Stats actuelles
   */
  getStats() {
    const elapsed = this.minuteStart ? Date.now() - this.minuteStart : 0;
    return {
      currentMinute: this.totalMinutes,
      requestsThisMinute: this.requestsThisMinute,
      tokensThisMinute: this.tokensThisMinute,
      maxRPM: this.maxRPM,
      maxTPM: this.maxTPM,
      rpmPercent: Math.round((this.requestsThisMinute / this.maxRPM) * 100),
      tpmPercent: Math.round((this.tokensThisMinute / this.maxTPM) * 100),
      secondsElapsed: Math.floor(elapsed / 1000),
      secondsRemaining: Math.ceil((60000 - elapsed) / 1000),
      totalRequests: this.totalRequests,
      totalTokens: this.totalTokens
    };
  }

  /**
   * Ajoute un log
   */
  log(message) {
    const timestamp = new Date().toISOString().substr(11, 8);
    const entry = `[${timestamp}] ${message}`;
    this.logs.push(entry);
    console.log(`[RateLimiter] ${entry}`);
    
    // Garder les 100 derniers logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  /**
   * Recupere les logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Reset complet
   */
  reset() {
    this.minuteStart = null;
    this.requestsThisMinute = 0;
    this.tokensThisMinute = 0;
    this.totalRequests = 0;
    this.totalTokens = 0;
    this.totalMinutes = 0;
    this.logs = [];
  }
}
