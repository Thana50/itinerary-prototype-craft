
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Server, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';
import { performanceMonitoringService, SystemHealth } from '@/services/performanceMonitoringService';
import { cacheService, CacheStats } from '@/services/cacheService';

const SystemHealthDashboard = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    cache: 'healthy',
    overall: 'healthy'
  });
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalItems: 0,
    totalHits: 0,
    totalMisses: 0,
    hitRate: 0,
    memoryUsage: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalMetrics: 0,
    avgLoadTime: 0,
    errorRate: 0,
    slowQueries: 0,
    cacheHitRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkSystemHealth = async () => {
    setIsLoading(true);
    try {
      const health = await performanceMonitoringService.checkSystemHealth();
      const cache = cacheService.getStats();
      const metrics = performanceMonitoringService.getMetricsSummary();
      
      setSystemHealth(health);
      setCacheStats(cache);
      setPerformanceMetrics(metrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to check system health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health Dashboard</h2>
          <p className="text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={checkSystemHealth} 
          variant="outline" 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getHealthIcon(systemHealth.overall)}
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Database className="h-5 w-5" />
                <span className="font-medium">Database</span>
              </div>
              <Badge className={`${getHealthColor(systemHealth.database)} text-white`}>
                {systemHealth.database.toUpperCase()}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="h-5 w-5" />
                <span className="font-medium">API</span>
              </div>
              <Badge className={`${getHealthColor(systemHealth.api)} text-white`}>
                {systemHealth.api.toUpperCase()}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Cache</span>
              </div>
              <Badge className={`${getHealthColor(systemHealth.cache)} text-white`}>
                {systemHealth.cache.toUpperCase()}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Performance</span>
              </div>
              <Badge className={`${getHealthColor(systemHealth.overall)} text-white`}>
                {systemHealth.overall.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Load Time</span>
              <span className="text-sm text-gray-600">
                {performanceMetrics.avgLoadTime.toFixed(0)}ms
              </span>
            </div>
            <Progress value={Math.min((performanceMetrics.avgLoadTime / 3000) * 100, 100)} />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <span className="text-sm text-gray-600">
                {performanceMetrics.errorRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={performanceMetrics.errorRate} className="bg-red-100" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Hit Rate</span>
              <span className="text-sm text-gray-600">
                {cacheStats.hitRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={cacheStats.hitRate} className="bg-green-100" />
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.totalMetrics}
                </div>
                <div className="text-sm text-gray-600">Total Metrics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {performanceMetrics.slowQueries}
                </div>
                <div className="text-sm text-gray-600">Slow Queries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Cache Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {cacheStats.totalItems}
                </div>
                <div className="text-sm text-blue-700">Cached Items</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {cacheStats.totalHits}
                </div>
                <div className="text-sm text-green-700">Cache Hits</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-600">
                  {formatBytes(cacheStats.memoryUsage)}
                </span>
              </div>
              <Progress value={(cacheStats.memoryUsage / (1024 * 1024)) * 10} />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Cache Efficiency</span>
              <Badge variant={cacheStats.hitRate > 70 ? "default" : "secondary"}>
                {cacheStats.hitRate > 70 ? 'Excellent' : 'Good'}
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                cacheService.clear();
                checkSystemHealth();
              }}
              className="w-full"
            >
              Clear Cache
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            System Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceMetrics.avgLoadTime > 2000 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">High Load Times Detected</p>
                  <p className="text-sm text-yellow-700">
                    Average load time is {performanceMetrics.avgLoadTime.toFixed(0)}ms. 
                    Consider optimizing images and reducing bundle size.
                  </p>
                </div>
              </div>
            )}
            
            {cacheStats.hitRate < 50 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Low Cache Hit Rate</p>
                  <p className="text-sm text-blue-700">
                    Cache hit rate is {cacheStats.hitRate.toFixed(1)}%. 
                    Consider implementing more aggressive caching strategies.
                  </p>
                </div>
              </div>
            )}
            
            {performanceMetrics.errorRate > 5 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">High Error Rate</p>
                  <p className="text-sm text-red-700">
                    Error rate is {performanceMetrics.errorRate.toFixed(1)}%. 
                    Review error logs and implement better error handling.
                  </p>
                </div>
              </div>
            )}
            
            {systemHealth.overall === 'healthy' && performanceMetrics.avgLoadTime < 1500 && cacheStats.hitRate > 70 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">System Running Optimally</p>
                  <p className="text-sm text-green-700">
                    All systems are healthy and performing well. Great job!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthDashboard;
