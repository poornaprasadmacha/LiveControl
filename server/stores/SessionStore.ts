export interface PinAttemptRecord {
  attempts: number;
  blockedUntil: number;
}

export class SessionStore {
  private failedAttempts: Map<string, PinAttemptRecord> = new Map();

  isRateLimited(clientIp: string): boolean {
    const record = this.failedAttempts.get(clientIp);
    if (!record) return false;
    if (Date.now() < record.blockedUntil) {
      return true;
    }
    // Block expired
    if (Date.now() >= record.blockedUntil && record.attempts >= 5) {
      this.failedAttempts.delete(clientIp);
    }
    return false;
  }

  recordFailedAttempt(clientIp: string): { remainingAttempts: number; blockedForSeconds?: number } {
    const record = this.failedAttempts.get(clientIp) || { attempts: 0, blockedUntil: 0 };
    record.attempts += 1;

    if (record.attempts >= 5) {
      const blockTimeMs = 5 * 60 * 1000; // Block 5 minutes after 5 failed attempts
      record.blockedUntil = Date.now() + blockTimeMs;
      this.failedAttempts.set(clientIp, record);
      return { remainingAttempts: 0, blockedForSeconds: 300 };
    }

    this.failedAttempts.set(clientIp, record);
    return { remainingAttempts: 5 - record.attempts };
  }

  recordSuccessfulAuth(clientIp: string): void {
    this.failedAttempts.delete(clientIp);
  }
}

export const sessionStore = new SessionStore();
