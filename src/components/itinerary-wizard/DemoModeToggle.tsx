import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onQuickDemo: (scenario: string) => void;
}

const DemoModeToggle: React.FC<DemoModeToggleProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onQuickDemo
}) => {
  const demoScenarios = [
    { label: "Luxury Bali Trip", value: "luxury-bali", emoji: "🏝️" },
    { label: "Paris Romance", value: "paris-romance", emoji: "🗼" },
    { label: "Tokyo Adventure", value: "tokyo-adventure", emoji: "🗾" }
  ];

  return (
    <div className="space-y-3">
      {isDemoMode && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Demo Mode Active</p>
                  <p className="text-xs text-yellow-700">Sample data pre-filled for quick demonstration</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onToggleDemoMode}
                className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
              >
                Exit Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Quick Demo Scenarios</h3>
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                Instant
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {demoScenarios.map((scenario) => (
                <Button
                  key={scenario.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickDemo(scenario.value)}
                  className="justify-start hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  <span className="mr-2">{scenario.emoji}</span>
                  Try: {scenario.label}
                </Button>
              ))}
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={onToggleDemoMode}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Sample Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoModeToggle;
