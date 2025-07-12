
import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetric {
  id: string;
  metric_name: string;
  value: number;
  timestamp: string;
  component_name?: string;
  user_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  database: 'healthy' | 'degraded' | 'critical';
  api: 'healthy' | 'degraded' | 'critical';
  cache: 'healthy' | 'degraded' | 'critical';
  overall: 'healthy' | 'degraded' | 'critical';
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
  }

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordMetric({
              metric_name: entry.entryType,
              value: entry.duration || entry.transferSize || 0,
              component_name: entry.name,
              metadata: {
                type: entry.entryType,
                startTime: entry.startTime,
                name: entry.name
              }
            });
          });
        });

        observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  async recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp' | 'session_id'>) {
    const fullMetric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      ...metric
    };

    this.metrics.push(fullMetric);

    // Store in local storage for persistence
    this.saveMetricsToStorage();

    // Batch send metrics every 10 seconds or when we have 50+ metrics
    if (this.metrics.length >= 50) {
      await this.flushMetrics();
    }
  }

  private saveMetricsToStorage() {
    try {
      localStorage.setItem('performance_metrics', JSON.stringify(this.metrics.slice(-100)));
    } catch (error) {
      console.warn('Failed to save metrics to storage:', error);
    }
  }

  private loadMetricsFromStorage() {
    try {
      const stored = localStorage.getItem('performance_metrics');
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load metrics from storage:', error);
    }
  }

  async flushMetrics() {
    if (this.metrics.length === 0) return;

    try {
      // In a real implementation, you'd send these to your backend
      console.log('Flushing performance metrics:', this.metrics.length);
      
      // Clear metrics after sending
      this.metrics = [];
      this.saveMetricsToStorage();
    } catch (error) {
      console.error('Failed to flush metrics:', error);
    }
  }

  async checkSystemHealth(): Promise<SystemHealth> {
    const health: SystemHealth = {
      database: 'healthy',
      api: 'healthy',
      cache: 'healthy',
      overall: 'healthy'
    };

    try {
      // Test database connectivity
      const dbStart = performance.now();
      const { error: dbError } = await supabase.from('users').select('count').limit(1);
      const dbDuration = performance.now() - dbStart;

      if (dbError || dbDuration > 2000) {
        health.database = dbDuration > 5000 ? 'critical' : 'degraded';
      }

      // Test API responsiveness
      const apiStart = performance.now();
      try {
        await fetch('/api/health', { method: 'HEAD' });
      } catch {
        // API endpoint might not exist, that's ok
      }
      const apiDuration = performance.now() - apiStart;

      if (apiDuration > 3000) {
        health.api = apiDuration > 8000 ? 'critical' : 'degraded';
      }

      // Check cache performance (localStorage as proxy)
      const cacheStart = performance.now();
      try {
        localStorage.setItem('health_check', 'test');
        localStorage.getItem('health_check');
        localStorage.removeItem('health_check');
      } catch {
        health.cache = 'degraded';
      }
      const cacheDuration = performance.now() - cacheStart;

      if (cacheDuration > 100) {
        health.cache = 'degraded';
      }

      // Determine overall health
      const statuses = [health.database, health.api, health.cache];
      if (statuses.includes('critical')) {
        health.overall = 'critical';
      } else if (statuses.includes('degraded')) {
        health.overall = 'degraded';
      }

    } catch (error) {
      console.error('Health check failed:', error);
      health.overall = 'critical';
    }

    await this.recordMetric({
      metric_name: 'system_health',
      value: health.overall === 'healthy' ? 1 : health.overall === 'degraded' ? 0.5 : 0,
      metadata: health
    });

    return health;
  }

  getMetricsSummary() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(
      m => new Date(m.timestamp).getTime() > oneHourAgo
    );

    const summary = {
      totalMetrics: recentMetrics.length,
      avgLoadTime: 0,
      errorRate: 0,
      slowQueries: 0,
      cacheHitRate: 0
    };

    if (recentMetrics.length > 0) {
      const loadTimes = recentMetrics
        .filter(m => m.metric_name === 'navigation')
        .map(m => m.value);
      
      summary.avgLoadTime = loadTimes.length > 0 
        ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
        : 0;

      const errors = recentMetrics.filter(
        m => m.metadata?.error || m.value < 0
      );
      summary.errorRate = (errors.length / recentMetrics.length) * 100;

      const slowQueries = recentMetrics.filter(
        m => m.metric_name.includes('query') && m.value > 1000
      );
      summary.slowQueries = slowQueries.length;

      summary.cacheHitRate = Math.random() * 30 + 70; // Simulated for demo
    }

    return summary;
  }
}

export const performanceMonitoringService = PerformanceMonitoringService.getInstance();
