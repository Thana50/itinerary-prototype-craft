
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Play, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Target,
  Clock,
  Award
} from "lucide-react";
import { ItineraryTemplate } from "@/types/templates";

interface TemplatePerformanceViewProps {
  template: ItineraryTemplate;
  onBack: () => void;
  onEdit: () => void;
  onUse: () => void;
}

const TemplatePerformanceView: React.FC<TemplatePerformanceViewProps> = ({
  template,
  onBack,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">{template.destination}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
            <Button onClick={onUse} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Template Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 mb-2">
                    {template.name}
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {template.preview}
                  </CardDescription>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 fill-current mr-1" />
                  <span className="text-lg font-medium">{template.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">{template.successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Times Used</p>
                  <p className="text-3xl font-bold text-blue-600">{template.timesUsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-3xl font-bold text-purple-600">{template.duration}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price Range</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(template.estimatedCost.min, template.estimatedCost.currency)} - {formatCurrency(template.estimatedCost.max, template.estimatedCost.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activities</CardTitle>
              <CardDescription>
                {template.activities.length} activities planned over {template.duration} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {template.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Day {activity.day} - {activity.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <span className="text-xs text-gray-500">Duration: {activity.duration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Usage statistics and client feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Average customizations per use</span>
                  <span className="font-medium">2.3</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Client satisfaction score</span>
                  <span className="font-medium">4.7/5.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Booking conversion rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Average final price variance</span>
                  <span className="font-medium">+8%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Repeat customer rate</span>
                  <span className="font-medium">34%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplatePerformanceView;
