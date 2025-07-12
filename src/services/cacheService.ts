
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheStats {
  totalItems: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  constructor() {
    // Clean up expired items every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);

    // Load cache from localStorage on initialization
    this.loadFromStorage();
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    };

    this.cache.set(key, item);
    this.saveToStorage();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.misses++;
      this.saveToStorage();
      return null;
    }

    // Update hit count and stats
    item.hits++;
    this.hits++;
    
    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.saveToStorage();
  }

  // Cache with function execution
  async memoize<T>(
    key: string, 
    fn: () => Promise<T>, 
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn();
    this.set(key, result, ttl);
    return result;
  }

  // Batch operations
  setMultiple<T>(items: Array<{ key: string; data: T; ttl?: number }>): void {
    items.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl);
    });
  }

  getMultiple<T>(keys: string[]): Array<{ key: string; data: T | null }> {
    return keys.map(key => ({
      key,
      data: this.get<T>(key)
    }));
  }

  // Cache statistics
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    
    return {
      totalItems: this.cache.size,
      totalHits: this.hits,
      totalMisses: this.misses,
      hitRate: totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0,
      memoryUsage: this.getMemoryUsage()
    };
  }

  // Get popular cache keys
  getPopularKeys(limit: number = 10): Array<{ key: string; hits: number }> {
    return Array.from(this.cache.entries())
      .map(([key, item]) => ({ key, hits: item.hits }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }

  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired items`);
      this.saveToStorage();
    }
  }

  private getMemoryUsage(): number {
    try {
      const cacheString = JSON.stringify(Array.from(this.cache.entries()));
      return new Blob([cacheString]).size;
    } catch {
      return 0;
    }
  }

  private saveToStorage(): void {
    try {
      const cacheData = {
        cache: Array.from(this.cache.entries()),
        hits: this.hits,
        misses: this.misses
      };
      localStorage.setItem('app_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('app_cache');
      if (stored) {
        const cacheData = JSON.parse(stored);
        this.cache = new Map(cacheData.cache || []);
        this.hits = cacheData.hits || 0;
        this.misses = cacheData.misses || 0;
        
        // Clean up any expired items on load
        this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }
}

export const cacheService = CacheService.getInstance();
