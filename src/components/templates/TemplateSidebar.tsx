import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Star, Clock, Users, MapPin, Calendar, TrendingUp, X } from 'lucide-react';
import { templateService } from '@/services/templateService';
import { ItineraryTemplate } from '@/types/templates';

interface TemplateSidebarProps {
  searchQuery: string;
  onTemplateSelect: (template: ItineraryTemplate) => void;
  onSearchChange: (query: string) => void;
  isVisible: boolean;
  onToggleSidebar: () => void;
}

const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
  searchQuery,
  onTemplateSelect,
  onSearchChange,
  isVisible,
  onToggleSidebar
}) => {
  const [templates, setTemplates] = useState<ItineraryTemplate[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<ItineraryTemplate[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<ItineraryTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const results = await templateService.searchTemplates(searchQuery);
        setTemplates(results);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [searchQuery]);

  useEffect(() => {
    const fetchPopularAndRecent = async () => {
      try {
        const [popular, recent] = await Promise.all([
          templateService.getPopularTemplates(),
          templateService.getRecentTemplates()
        ]);
        setPopularTemplates(popular);
        setRecentTemplates(recent);
      } catch (error) {
        console.error('Failed to fetch popular/recent templates:', error);
      }
    };

    if (isVisible) {
      fetchPopularAndRecent();
    }
  }, [isVisible]);

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

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto fixed right-0 top-0 z-40">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded"></div>
            </div>
            <span className="font-semibold text-gray-900">Travia Templates</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search destinations, activities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!searchQuery && (
          <>
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-gray-900">Popular Templates</h3>
              </div>
              <div className="space-y-2">
                {popularTemplates.slice(0, 3).map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3" onClick={() => onTemplateSelect(template)}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{template.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{template.duration}d</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{template.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{template.timesUsed}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-gray-900">Recently Used</h3>
              </div>
              <div className="space-y-2">
                {recentTemplates.slice(0, 2).map((template) => (
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

            <Separator />
          </>
        )}

        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            {searchQuery ? `Search Results (${templates.length})` : 'All Templates'}
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="flex space-x-2">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3" onClick={() => onTemplateSelect(template)}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.preview}</p>
                    
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
                        </div>
                        <span className="text-xs font-medium text-blue-600">
                          ${template.estimatedCost.min.toLocaleString()} - ${template.estimatedCost.max.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {templates.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No templates found</p>
                  <p className="text-xs text-gray-400">Try different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-center text-gray-500">
          <span className="font-medium">Travia</span> - Where Custom Trips Click
        </p>
      </div>
    </div>
  );
};

export default TemplateSidebar;
