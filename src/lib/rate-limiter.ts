interface RateLimitEntry {
  count: number;
  timestamp: number;
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindowMs: number;

  constructor(maxRequests: number, timeWindowMs: number) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      // First request
      this.cache.set(key, { count: 1, timestamp: now });
      return false;
    }

    // Check if the time window has passed
    if (now - entry.timestamp > this.timeWindowMs) {
      // Reset the counter
      this.cache.set(key, { count: 1, timestamp: now });
      return false;
    }

    // Increment the counter if within the window
    if (entry.count < this.maxRequests) {
      this.cache.set(key, {
        count: entry.count + 1,
        timestamp: entry.timestamp,
      });
      return false;
    }

    return true;
  }
}

// Export a singleton instance with 20 requests per hour
export const geminiRateLimiter = new RateLimiter(20, 60 * 60 * 1000);
