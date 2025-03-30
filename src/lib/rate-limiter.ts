interface RequestTimestamp {
  timestamp: number;
}

export class RateLimiter {
  private requestHistory: Map<string, RequestTimestamp[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing timestamps or create a new array
    const timestamps = this.requestHistory.get(key) || [];

    // Filter out timestamps older than the window
    const recentTimestamps = timestamps.filter(
      (entry) => entry.timestamp > windowStart
    );

    // Check if we're at the limit
    if (recentTimestamps.length >= this.maxRequests) {
      return true;
    }

    // Add the current request timestamp
    recentTimestamps.push({ timestamp: now });

    // Update the history
    this.requestHistory.set(key, recentTimestamps);

    return false;
  }
}

// Export a singleton instance with 20 requests per hour
export const geminiRateLimiter = new RateLimiter(20, 60 * 60 * 1000);
