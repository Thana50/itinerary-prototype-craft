
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Play
} from "lucide-react";
import { ItineraryTemplate } from "@/types/templates";

interface TemplateCardProps {
  template: ItineraryTemplate;
  onView: () => void;
  onEdit: () => void;
  onUse: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onEdit,
  onUse
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      family: 'bg-green-100 text-green-800',
      luxury: 'bg-purple-100 text-purple-800',
      adventure: 'bg-orange-100 text-orange-800',
      cultural: 'bg-blue-100 text-blue-800',
      beach: 'bg-cyan-100 text-cyan-800',
      budget: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency === 'USD' ? '$' : currency}${amount.toLocaleString()}`;
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-2">
              {template.destination}
            </CardDescription>
            <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
              {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="text-sm font-medium">{template.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {template.preview}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-3 w-3 mr-1" />
            {template.duration} days
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-3 w-3 mr-1" />
            Used {template.timesUsed}x
          </div>
          <div className="flex items-center text-gray-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {template.successRate}% success
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-3 w-3 mr-1" />
            {formatCurrency(template.estimatedCost.min, template.estimatedCost.currency)}+
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Last Used */}
        <div className="text-xs text-gray-500 mb-4">
          Last used: {formatLastUsed(template.lastUsed)}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onUse}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-3 w-3 mr-1" />
            Use Template
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onView}
            className="px-3"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="px-3"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
