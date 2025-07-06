
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { ItineraryTemplate } from '@/types/templates';

interface RecentTemplatesSectionProps {
  templates: ItineraryTemplate[];
  onTemplateSelect: (template: ItineraryTemplate) => void;
}

const RecentTemplatesSection: React.FC<RecentTemplatesSectionProps> = ({
  templates,
  onTemplateSelect
}) => {
  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="h-4 w-4 text-green-500" />
        <h3 className="font-medium text-gray-900">Recently Used</h3>
      </div>
      <div className="space-y-2">
        {templates.slice(0, 2).map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3" onClick={() => onTemplateSelect(template)}>
              <h4 className="font-medium text-sm text-gray-900 mb-1">{template.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{template.destination}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {formatLastUsed(template.lastUsed)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {template.successRate}% success
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentTemplatesSection;
