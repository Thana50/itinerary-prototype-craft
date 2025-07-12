
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  Zap, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Clock,
  HardDrive
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueryPerformance {
  query: string;
  avgDuration: number;
  executionCount: number;
  lastExecuted: string;
  optimizationSuggestion?: string;
}

interface DatabaseStats {
  totalQueries: number;
  slowQueries: number;
  avgResponseTime: number;
  cacheHitRatio: number;
  connectionCount: number;
  tableStats: Array<{
    tableName: string;
    rowCount: number;
    size: string;
    indexEfficiency: number;
  }>;
}

const DatabaseOptimizer = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalQueries: 0,
    slowQueries: 0,
    avgResponseTime: 0,
    cacheHitRatio: 0,
    connectionCount: 0,
    tableStats: []
  });
  const [slowQueries, setSlowQueries] = useState<QueryPerformance[]>([]);
  const [optimizationStatus, setOptimizationStatus] = useState<{
    indexOptimization: 'pending' | 'running' | 'completed';
    queryOptimization: 'pending' | 'running' | 'completed';
    cacheOptimization: 'pending' | 'running' | 'completed';
  }>({
    indexOptimization: 'pending',
    queryOptimization: 'pending',
    cacheOptimization: 'pending'
  });

  const analyzeDatabase = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate database analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock database statistics
      const mockStats: DatabaseStats = {
        totalQueries: 1247,
        slowQueries: 23,
        avgResponseTime: 145,
        cacheHitRatio: 78.5,
        connectionCount: 12,
        tableStats: [
          {
            tableName: 'itineraries',
            rowCount: 1532,
            size: '2.3 MB',
            indexEfficiency: 85
          },
          {
            tableName: 'negotiations',
            rowCount: 4721,
            size: '8.7 MB',
            indexEfficiency: 72
          },
          {
            tableName: 'users',
            rowCount: 892,
            size: '1.1 MB',
            indexEfficiency: 95
          },
          {
            tableName: 'vendor_services',
            rowCount: 2341,
            size: '3.8 MB',
            indexEfficiency: 68
          }
        ]
      };

      const mockSlowQueries: QueryPerformance[] = [
        {
          query: 'SELECT * FROM negotiations WHERE status = ? AND created_at > ?',
          avgDuration: 2340,
          executionCount: 156,
          lastExecuted: '2 minutes ago',
          optimizationSuggestion: 'Add composite index on (status, created_at)'
        },
        {
          query: 'SELECT COUNT(*) FROM itineraries GROUP BY destination',
          avgDuration: 1890,
          executionCount: 89,
          lastExecuted: '5 minutes ago',
          optimizationSuggestion: 'Consider materialized view for aggregated data'
        },
        {
          query: 'SELECT * FROM vendor_services WHERE location LIKE ?',
          avgDuration: 1650,
          executionCount: 234,
          lastExecuted: '1 minute ago',
          optimizationSuggestion: 'Use full-text search index for location queries'
        }
      ];

      setDbStats(mockStats);
      setSlowQueries(mockSlowQueries);

      toast({
        title: "Database Analysis Complete",
        description: `Found ${mockSlowQueries.length} optimization opportunities`,
      });

    } catch (error) {
      console.error('Database analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze database performance",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeIndexes = async () => {
    setOptimizationStatus(prev => ({ ...prev, indexOptimization: 'running' }));
    
    try {
      // Simulate index optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setOptimizationStatus(prev => ({ ...prev, indexOptimization: 'completed' }));
      
      toast({
        title: "Index Optimization Complete",
        description: "Database indexes have been optimized for better performance",
      });
      
      // Refresh stats
      await analyzeDatabase();
      
    } catch (error) {
      console.error('Index optimization failed:', error);
      setOptimizationStatus(prev => ({ ...prev, indexOptimization: 'pending' }));
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize database indexes",
        variant: "destructive"
      });
    }
  };

  const optimizeQueries = async () => {
    setOptimizationStatus(prev => ({ ...prev, queryOptimization: 'running' }));
    
    try {
      // Simulate query optimization
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setOptimizationStatus(prev => ({ ...prev, queryOptimization: 'completed' }));
      
      toast({
        title: "Query Optimization Complete",
        description: "Slow queries have been identified and optimized",
      });
      
    } catch (error) {
      console.error('Query optimization failed:', error);
      setOptimizationStatus(prev => ({ ...prev, queryOptimization: 'pending' }));
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize database queries",
        variant: "destructive"
      });
    }
  };

  const optimizeCache = async () => {
    setOptimizationStatus(prev => ({ ...prev, cacheOptimization: 'running' }));
    
    try {
      // Simulate cache optimization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOptimizationStatus(prev => ({ ...prev, cacheOptimization: 'completed' }));
      
      toast({
        title: "Cache Optimization Complete",
        description: "Database cache settings have been optimized",
      });
      
    } catch (error) {
      console.error('Cache optimization failed:', error);
      setOptimizationStatus(prev => ({ ...prev, cacheOptimization: 'pending' }));
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize database cache",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    analyzeDatabase();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Settings className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'running':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Optimizer</h2>
          <p className="text-gray-600">Monitor and optimize database performance</p>
        </div>
        <Button 
          onClick={analyzeDatabase} 
          variant="outline" 
          disabled={isAnalyzing}
        >
          <BarChart3 className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-pulse' : ''}`} />
          Analyze Database
        </Button>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Queries</p>
                <p className="text-xl font-bold">{dbStats.totalQueries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Slow Queries</p>
                <p className="text-xl font-bold">{dbStats.slowQueries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-xl font-bold">{dbStats.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cache Hit Ratio</p>
                <p className="text-xl font-bold">{dbStats.cacheHitRatio}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Index Optimization</h4>
                {getStatusIcon(optimizationStatus.indexOptimization)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Optimize database indexes for better query performance
              </p>
              <Button 
                onClick={optimizeIndexes}
                disabled={optimizationStatus.indexOptimization === 'running'}
                size="sm"
                className="w-full"
              >
                {optimizationStatus.indexOptimization === 'running' ? 'Optimizing...' : 'Optimize Indexes'}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Query Optimization</h4>
                {getStatusIcon(optimizationStatus.queryOptimization)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Analyze and optimize slow-running queries
              </p>
              <Button 
                onClick={optimizeQueries}
                disabled={optimizationStatus.queryOptimization === 'running'}
                size="sm"
                className="w-full"
              >
                {optimizationStatus.queryOptimization === 'running' ? 'Optimizing...' : 'Optimize Queries'}
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Cache Optimization</h4>
                {getStatusIcon(optimizationStatus.cacheOptimization)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Optimize database cache settings and strategies
              </p>
              <Button 
                onClick={optimizeCache}
                disabled={optimizationStatus.cacheOptimization === 'running'}
                size="sm"
                className="w-full"
              >
                {optimizationStatus.cacheOptimization === 'running' ? 'Optimizing...' : 'Optimize Cache'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Table Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dbStats.tableStats.map((table, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{table.tableName}</h4>
                  <Badge variant={table.indexEfficiency > 80 ? "default" : "secondary"}>
                    {table.indexEfficiency}% Efficient
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rows:</span>
                    <div className="font-medium">{table.rowCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <div className="font-medium">{table.size}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Index Efficiency:</span>
                    <Progress value={table.indexEfficiency} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slow Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Slow Query Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {slowQueries.map((query, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-4">
                    {query.query}
                  </code>
                  <Badge variant="destructive">
                    {query.avgDuration}ms
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                  <div>Executions: {query.executionCount}</div>
                  <div>Last executed: {query.lastExecuted}</div>
                </div>
                {query.optimizationSuggestion && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Suggestion:</strong> {query.optimizationSuggestion}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseOptimizer;
