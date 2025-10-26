import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Award, Users } from "lucide-react";

interface BusinessMetricsProps {
  showTimer?: boolean;
  startTime?: number;
}

const BusinessMetrics: React.FC<BusinessMetricsProps> = ({ 
  showTimer = false,
  startTime = 0 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (showTimer && startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showTimer, startTime]);

  const metrics = [
    {
      icon: Clock,
      label: "Time Saved",
      value: "18 minutes",
      subtext: "vs Traditional method: 20 min",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      label: "AI Confidence",
      value: "94%",
      subtext: "Based on similar trips",
      color: "text-green-500"
    },
    {
      icon: Users,
      label: "Data Points",
      value: "1,000+",
      subtext: "Successful trips analyzed",
      color: "text-purple-500"
    },
    {
      icon: Award,
      label: "Quality Score",
      value: "9.2/10",
      subtext: "Average client rating",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="space-y-4">
      {showTimer && startTime > 0 && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Generated in</p>
                <p className="text-3xl font-bold">{elapsedTime}s</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Traditional Method</p>
                <p className="text-xl font-semibold line-through opacity-90">20 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500 truncate">{metric.subtext}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessMetrics;
