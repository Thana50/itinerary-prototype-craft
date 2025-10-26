import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookTemplate, TrendingUp, MapPin, Calendar } from "lucide-react";
import { templateService } from "@/services/templateService";
import { ItineraryTemplate } from "@/types/templates";

interface TemplateSuggestionsPanelProps {
  destination: string;
  onTemplateSelect: (template: ItineraryTemplate) => void;
}

const TemplateSuggestionsPanel: React.FC<TemplateSuggestionsPanelProps> = ({
  destination,
  onTemplateSelect
}) => {
  const [templates, setTemplates] = useState<ItineraryTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const results = destination 
          ? await templateService.searchTemplates(destination)
          : await templateService.getPopularTemplates();
        setTemplates(results.slice(0, 3));
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [destination]);

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookTemplate className="h-4 w-4 text-primary" />
          Recommended Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Enter a destination to see template suggestions
              </p>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="border-border hover:border-primary transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                        {template.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.preview}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <MapPin className="h-3 w-3" />
                        {template.destination}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Calendar className="h-3 w-3" />
                        {template.duration} days
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {template.timesUsed} uses
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Success Rate: <span className="font-semibold text-primary">{template.successRate}%</span>
                      </span>
                      <Button
                        size="sm"
                        onClick={() => onTemplateSelect(template)}
                        className="h-7 text-xs"
                      >
                        Load Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateSuggestionsPanel;
