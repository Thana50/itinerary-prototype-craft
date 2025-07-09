
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  X, 
  Save, 
  MapPin, 
  Calendar, 
  Users,
  DollarSign,
  Tag
} from "lucide-react";
import { ItineraryTemplate, TemplateActivity, TemplateAccommodation, TemplateMeal } from "@/types/templates";
import ItineraryMap from "@/components/ItineraryMap";

interface TemplateCreationWizardProps {
  template?: ItineraryTemplate;
  onClose: () => void;
  onSave: (template: ItineraryTemplate) => void;
}

const TemplateCreationWizard: React.FC<TemplateCreationWizardProps> = ({
  template,
  onClose,
  onSave
}) => {
  const isEditing = !!template;
  
  const [formData, setFormData] = useState({
    name: template?.name || '',
    destination: template?.destination || '',
    duration: template?.duration || 7,
    category: template?.category || 'cultural',
    preview: template?.preview || '',
    tags: template?.tags || [],
    estimatedCost: template?.estimatedCost || { min: 1000, max: 2000, currency: 'USD' },
    activities: template?.activities || [],
    accommodations: template?.accommodations || [],
    meals: template?.meals || []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  // Convert activities to map format
  const getMapActivities = () => {
    return formData.activities
      .filter(activity => activity.coordinates)
      .map(activity => ({
        name: activity.title,
        coordinates: activity.coordinates as [number, number],
        day: activity.day,
        type: activity.type
      }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCostChange = (field: 'min' | 'max', value: number) => {
    setFormData(prev => ({
      ...prev,
      estimatedCost: {
        ...prev.estimatedCost,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addActivity = () => {
    const newActivity: TemplateActivity = {
      day: 1,
      time: '09:00',
      title: 'New Activity',
      description: '',
      type: 'sightseeing',
      duration: '2 hours',
      isCustomizable: true,
      alternatives: [],
      coordinates: undefined
    };
    
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const updateActivity = (index: number, field: keyof TemplateActivity, value: any) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const templateToSave: ItineraryTemplate = {
      id: template?.id || `template-${Date.now()}`,
      name: formData.name,
      destination: formData.destination,
      duration: formData.duration,
      category: formData.category as any,
      successRate: template?.successRate || 90,
      lastUsed: new Date().toISOString(),
      timesUsed: template?.timesUsed || 0,
      rating: template?.rating || 4.5,
      preview: formData.preview,
      tags: formData.tags,
      activities: formData.activities,
      accommodations: formData.accommodations,
      meals: formData.meals,
      customizationPoints: template?.customizationPoints || [],
      estimatedCost: formData.estimatedCost
    };

    onSave(templateToSave);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Bali Cultural Adventure"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="e.g., Bali, Indonesia"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="preview">Preview Description</Label>
              <Textarea
                id="preview"
                value={formData.preview}
                onChange={(e) => handleInputChange('preview', e.target.value)}
                placeholder="Brief description of what makes this template special..."
                rows={3}
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Activities</h3>
              <Button onClick={addActivity} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.activities.map((activity, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Day {activity.day} Activity</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        value={activity.day}
                        onChange={(e) => updateActivity(index, 'day', parseInt(e.target.value))}
                        placeholder="Day"
                        min="1"
                      />
                      <Input
                        type="time"
                        value={activity.time}
                        onChange={(e) => updateActivity(index, 'time', e.target.value)}
                      />
                      <Input
                        value={activity.duration}
                        onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                        placeholder="Duration"
                      />
                    </div>
                    <Input
                      value={activity.title}
                      onChange={(e) => updateActivity(index, 'title', e.target.value)}
                      placeholder="Activity title"
                    />
                    <Textarea
                      value={activity.description}
                      onChange={(e) => updateActivity(index, 'description', e.target.value)}
                      placeholder="Activity description"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={activity.coordinates?.[0] || ''}
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value);
                          const currentCoords = activity.coordinates || [0, 0];
                          updateActivity(index, 'coordinates', [lng, currentCoords[1]]);
                        }}
                        placeholder="Longitude"
                        type="number"
                        step="any"
                      />
                      <Input
                        value={activity.coordinates?.[1] || ''}
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value);
                          const currentCoords = activity.coordinates || [0, 0];
                          updateActivity(index, 'coordinates', [currentCoords[0], lat]);
                        }}
                        placeholder="Latitude"
                        type="number"
                        step="any"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <ItineraryMap
              activities={getMapActivities()}
              destination={formData.destination || 'Template Location'}
            />
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-2">Accommodations</h3>
              <p>Accommodation management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div>
              <Label>Estimated Cost Range</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="minCost" className="text-sm">Minimum</Label>
                  <Input
                    id="minCost"
                    type="number"
                    value={formData.estimatedCost.min}
                    onChange={(e) => handleCostChange('min', parseInt(e.target.value))}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="maxCost" className="text-sm">Maximum</Label>
                  <Input
                    id="maxCost"
                    type="number"
                    value={formData.estimatedCost.max}
                    onChange={(e) => handleCostChange('max', parseInt(e.target.value))}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label className="text-sm">Currency</Label>
                  <Select 
                    value={formData.estimatedCost.currency} 
                    onValueChange={(value) => handleInputChange('estimatedCost', {...formData.estimatedCost, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCreationWizard;
