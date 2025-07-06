
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { ItineraryTemplate } from '@/types/templates';

interface TemplateCardProps {
  template: ItineraryTemplate;
  onSelect: (template: ItineraryTemplate) => void;
  showExtendedInfo?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onSelect, 
  showExtendedInfo = true 
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      beach: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      adventure: 'bg-green-100 text-green-800',
      family: 'bg-orange-100 text-orange-800',
      luxury: 'bg-yellow-100 text-yellow-800',
      budget: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3" onClick={() => onSelect(template)}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
          <Badge className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
        </div>
        
        {showExtendedInfo && template.preview && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.preview}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{template.destination}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{template.duration} days</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{template.rating}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {template.successRate}% success
              </Badge>
              {showExtendedInfo && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{template.timesUsed}</span>
                </div>
              )}
            </div>
            {showExtendedInfo && (
              <span className="text-xs font-medium text-blue-600">
                ${template.estimatedCost.min.toLocaleString()} - ${template.estimatedCost.max.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        {showExtendedInfo && template.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
