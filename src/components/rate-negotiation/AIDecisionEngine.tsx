import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Brain, Settings, Target } from "lucide-react";
import EnhancedAIDecisionEngine from "./EnhancedAIDecisionEngine";

const AIDecisionEngine = () => {
  const [showEnhancedMode, setShowEnhancedMode] = useState(false);
  const [negotiationStyle, setNegotiationStyle] = useState("balanced");
  const [autoAcceptThreshold, setAutoAcceptThreshold] = useState([95]);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState([150]);
  const [humanReviewRange, setHumanReviewRange] = useState([80, 94]);
  const [trainingMode, setTrainingMode] = useState(true);

  if (showEnhancedMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Enhanced AI Decision Engine</h2>
          <button
            onClick={() => setShowEnhancedMode(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Basic Mode
          </button>
        </div>
        <EnhancedAIDecisionEngine />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Basic AI Decision Engine</h2>
        <button
          onClick={() => setShowEnhancedMode(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          Switch to Enhanced Mode
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            <CardTitle>Negotiation Style Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Current AI Personality: {negotiationStyle.charAt(0).toUpperCase() + negotiationStyle.slice(1)} Professional</Label>
              <RadioGroup value={negotiationStyle} onValueChange={setNegotiationStyle} className="mt-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative" className="cursor-pointer">
                    <span className="font-medium">Conservative</span> - Higher acceptance rates, smaller discounts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="cursor-pointer">
                    <span className="font-medium">Balanced</span> - Moderate risk/reward (default)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive" className="cursor-pointer">
                    <span className="font-medium">Aggressive</span> - Lower acceptance rates, larger discounts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">
                    <span className="font-medium">Custom</span> - Full manual control
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle>Decision Thresholds</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Auto-Accept Threshold: {autoAcceptThreshold[0]}%</Label>
            <p className="text-xs text-gray-600 mb-3">Offers within {100 - autoAcceptThreshold[0]}% of target rate will be automatically accepted</p>
            <Slider
              value={autoAcceptThreshold}
              onValueChange={setAutoAcceptThreshold}
              max={100}
              min={90}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Auto-Reject Threshold: {autoRejectThreshold[0]}%</Label>
            <p className="text-xs text-gray-600 mb-3">Offers more than {autoRejectThreshold[0] - 100}% above target will be automatically rejected</p>
            <Slider
              value={autoRejectThreshold}
              onValueChange={setAutoRejectThreshold}
              max={200}
              min={120}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Human Review Trigger: {humanReviewRange[0]}-{humanReviewRange[1]}%</Label>
            <p className="text-xs text-gray-600 mb-3">Offers in this range will be flagged for your review</p>
            <Slider
              value={humanReviewRange}
              onValueChange={setHumanReviewRange}
              max={95}
              min={70}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-green-600 mr-2" />
            <CardTitle>Training & Learning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">🎓 AI Training Mode</Label>
              <p className="text-xs text-gray-600">AI will explain reasoning and highlight uncertainties</p>
            </div>
            <Switch checked={trainingMode} onCheckedChange={setTrainingMode} />
          </div>
          
          {trainingMode && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Training mode active: AI will provide detailed explanations and save successful patterns
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDecisionEngine;
