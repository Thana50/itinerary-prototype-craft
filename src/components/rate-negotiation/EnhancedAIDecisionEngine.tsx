
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, TrendingUp, Target, Save } from "lucide-react";
import { enhancedAIDecisionEngine, type AIDecisionConfig } from "@/services/enhancedAIDecisionEngine";
import { useToast } from "@/hooks/use-toast";

const EnhancedAIDecisionEngine = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AIDecisionConfig>({
    negotiationStyle: 'balanced',
    autoAcceptThreshold: 10,
    autoRejectThreshold: 30,
    humanReviewRange: [20, 29],
    trainingMode: true
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      const metrics = await enhancedAIDecisionEngine.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      setIsLoading(true);
      enhancedAIDecisionEngine.updateConfig(config);
      
      toast({
        title: "Configuration Updated",
        description: "AI Decision Engine settings have been updated successfully.",
      });
      
      await loadPerformanceMetrics();
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {performanceMetrics && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle className="text-blue-900">AI Performance Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(performanceMetrics.accuracy * 100)}%
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(performanceMetrics.avgConfidence * 100)}%
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(performanceMetrics.successRate * 100)}%
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <p className="text-xs text-gray-600">Avg Savings</p>
                <p className="text-2xl font-bold text-orange-600">
                  {performanceMetrics.avgSavings}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle>Enhanced AI Configuration</CardTitle>
            </div>
            <Badge className="bg-purple-600 text-white">
              {config.trainingMode ? 'Training Mode' : 'Production Mode'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Negotiation Style */}
          <div>
            <Label className="text-sm font-medium">AI Negotiation Style</Label>
            <Select 
              value={config.negotiationStyle} 
              onValueChange={(value: any) => setConfig({...config, negotiationStyle: value})}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative - Safe, higher acceptance rates</SelectItem>
                <SelectItem value="balanced">Balanced - Optimal risk/reward balance</SelectItem>
                <SelectItem value="aggressive">Aggressive - Maximum savings potential</SelectItem>
                <SelectItem value="custom">Custom - Advanced rule-based approach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-Accept Threshold */}
          <div>
            <Label className="text-sm font-medium">
              Auto-Accept Threshold: {config.autoAcceptThreshold}%
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Offers within this percentage of target will be automatically accepted
            </p>
            <Slider
              value={[config.autoAcceptThreshold]}
              onValueChange={([value]) => setConfig({...config, autoAcceptThreshold: value})}
              max={25}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Auto-Reject Threshold */}
          <div>
            <Label className="text-sm font-medium">
              Auto-Reject Threshold: {config.autoRejectThreshold}%
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Offers exceeding this percentage above target will be automatically rejected
            </p>
            <Slider
              value={[config.autoRejectThreshold]}
              onValueChange={([value]) => setConfig({...config, autoRejectThreshold: value})}
              max={50}
              min={25}
              step={5}
              className="w-full"
            />
          </div>

          {/* Human Review Range */}
          <div>
            <Label className="text-sm font-medium">
              Human Review Range: {config.humanReviewRange[0]}% - {config.humanReviewRange[1]}%
            </Label>
            <p className="text-xs text-gray-600 mb-3">
              Offers in this range will be flagged for agent review
            </p>
            <Slider
              value={config.humanReviewRange}
              onValueChange={(values) => setConfig({...config, humanReviewRange: values as [number, number]})}
              max={config.autoRejectThreshold - 1}
              min={config.autoAcceptThreshold + 1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Training Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enhanced Learning Mode</Label>
              <p className="text-xs text-gray-600">
                AI provides detailed explanations and continuously learns from outcomes
              </p>
            </div>
            <Switch 
              checked={config.trainingMode} 
              onCheckedChange={(checked) => setConfig({...config, trainingMode: checked})} 
            />
          </div>

          {config.trainingMode && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Enhanced Learning Active</span>
              </div>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Real-time market intelligence integration</li>
                <li>• Predictive success probability modeling</li>
                <li>• Dynamic pricing strategy optimization</li>
                <li>• Vendor relationship pattern recognition</li>
              </ul>
            </div>
          )}

          <Button 
            onClick={handleConfigUpdate}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Updating...' : 'Save Configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle>Advanced AI Features</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium">Market Intelligence</span>
              </div>
              <p className="text-sm text-gray-600">
                Real-time market data analysis and competitive intelligence integration
              </p>
              <Badge className="mt-2 bg-green-500 text-white">Active</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="h-4 w-4 text-purple-600 mr-2" />
                <span className="font-medium">Predictive Analytics</span>
              </div>
              <p className="text-sm text-gray-600">
                Success probability modeling and outcome prediction
              </p>
              <Badge className="mt-2 bg-green-500 text-white">Active</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600 mr-2" />
                <span className="font-medium">Dynamic Pricing</span>
              </div>
              <p className="text-sm text-gray-600">
                Adaptive pricing strategies based on market conditions
              </p>
              <Badge className="mt-2 bg-green-500 text-white">Active</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Settings className="h-4 w-4 text-gray-600 mr-2" />
                <span className="font-medium">Vendor Profiling</span>
              </div>
              <p className="text-sm text-gray-600">
                Historical pattern analysis and relationship optimization
              </p>
              <Badge className="mt-2 bg-green-500 text-white">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIDecisionEngine;
