import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface QuerySample {
  text: string;
  icon: string;
}

const querySamples: QuerySample[] = [
  { text: "Create a 7-day luxury Bali trip for family of 4", icon: "🌴" },
  { text: "Plan romantic 5-day Maldives honeymoon", icon: "💑" },
  { text: "Design cultural Singapore adventure for 6 people", icon: "🏛️" },
  { text: "Build business trip to Bangkok with halal options", icon: "🕌" }
];

interface QuerySamplesSectionProps {
  onSampleClick: (sample: string) => void;
}

const QuerySamplesSection: React.FC<QuerySamplesSectionProps> = ({ onSampleClick }) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Try These Examples</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {querySamples.map((sample, index) => (
            <button
              key={index}
              onClick={() => onSampleClick(sample.text)}
              className="group text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {sample.icon}
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {sample.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuerySamplesSection;
