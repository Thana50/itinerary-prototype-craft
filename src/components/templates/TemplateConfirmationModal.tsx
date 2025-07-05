
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Settings,
  Utensils,
  Bed,
  Activity
} from 'lucide-react';
import { ItineraryTemplate } from '@/types/templates';

interface TemplateConfirmationModalProps {
  template: ItineraryTemplate | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const TemplateConfirmationModal: React.FC<TemplateConfirmationModalProps> = ({
  template,
  onConfirm,
  onCancel
}) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({});

  if (!template) return null;

  const handleCustomizationChange = (pointId: string, value: string) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [pointId]: value
    }));
  };

  const handleConfirm = () => {
    onConfirm();
  };

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
    <Dialog open={!!template} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Load Template: {template.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Template Overview</span>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{template.preview}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="font-medium">{template.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{template.duration} days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <p className="font-medium">{template.successRate}%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Est. Cost</p>
                    <p className="font-medium">${template.estimatedCost.min.toLocaleString()} - ${template.estimatedCost.max.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{template.activities.length}</p>
                <p className="text-xs text-gray-500">Activities</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Bed className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{template.accommodations.length}</p>
                <p className="text-xs text-gray-500">Accommodations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{template.meals.length}</p>
                <p className="text-xs text-gray-500">Meals Planned</p>
              </CardContent>
            </Card>
          </div>

          {/* Customization Points */}
          {template.customizationPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Customize Your Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.customizationPoints.map((point) => (
                  <div key={point.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Day {point.day}</Badge>
                      <h4 className="font-medium">{point.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{point.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {point.options.map((option) => (
                        <Button
                          key={option}
                          variant={
                            (selectedCustomizations[point.id] || point.defaultOption) === option 
                              ? "default" 
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleCustomizationChange(point.id, option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sample Activities Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Daily Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.activities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Badge variant="outline">Day {activity.day}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{activity.duration}</span>
                        {activity.isCustomizable && (
                          <Badge variant="secondary" className="text-xs">
                            Customizable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {template.activities.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    + {template.activities.length - 3} more activities...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              This template has been used <span className="font-medium">{template.timesUsed} times</span> 
              with a <span className="font-medium">{template.successRate}% success rate</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You can further customize this itinerary using the AI chat after loading
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
              Load Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateConfirmationModal;
