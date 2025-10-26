import React from "react";
import { Sparkles, Brain, Zap, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AIStatusIndicatorProps {
  status: 'idle' | 'analyzing' | 'generating' | 'complete';
  confidence?: number;
  message?: string;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ 
  status, 
  confidence = 0,
  message 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'analyzing':
        return {
          icon: Brain,
          text: message || "Analyzing preferences...",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          animate: "animate-pulse"
        };
      case 'generating':
        return {
          icon: Zap,
          text: message || "Generating personalized itinerary...",
          color: "text-purple-500",
          bgColor: "bg-purple-50",
          animate: "animate-pulse"
        };
      case 'complete':
        return {
          icon: CheckCircle,
          text: message || "AI processing complete",
          color: "text-green-500",
          bgColor: "bg-green-50",
          animate: ""
        };
      default:
        return {
          icon: Sparkles,
          text: "AI ready to assist",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          animate: ""
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} border-none shadow-sm p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${config.animate}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </p>
            {confidence > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                AI Confidence: {confidence}%
              </p>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="bg-white/50">
          <Sparkles className="h-3 w-3 mr-1" />
          Advanced NLP
        </Badge>
      </div>
      {status !== 'idle' && status !== 'complete' && (
        <Progress value={75} className="mt-3 h-1" />
      )}
    </Card>
  );
};

export default AIStatusIndicator;
