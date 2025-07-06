
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Edit, Eye, CheckCircle } from "lucide-react";

interface TemplateLifecycleViewProps {
  timeRange: string;
}

const TemplateLifecycleView: React.FC<TemplateLifecycleViewProps> = ({ timeRange }) => {
  const templateLifecycles = [
    {
      id: "phuket-beach-7d",
      name: "Phuket Beach Paradise",
      status: "Active",
      created: "2024-01-15",
      lastModified: "2024-06-20",
      usage: 45,
      success: 94,
      stage: "Mature"
    },
    {
      id: "singapore-family-5d", 
      name: "Singapore Family Adventure",
      status: "Active",
      created: "2024-02-10",
      lastModified: "2024-06-18",
      usage: 38,
      success: 91,
      stage: "Growth"
    },
    {
      id: "bali-cultural-6d",
      name: "Bali Cultural Immersion", 
      status: "Under Review",
      created: "2024-03-05",
      lastModified: "2024-06-25",
      usage: 32,
      success: 89,
      stage: "Review"
    },
    {
      id: "tokyo-modern-8d",
      name: "Tokyo Modern Explorer",
      status: "Active",
      created: "2024-04-12",
      lastModified: "2024-06-15",
      usage: 28,
      success: 87,
      stage: "Growth"
    },
    {
      id: "dubai-luxury-5d",
      name: "Dubai Luxury Experience",
      status: "New",
      created: "2024-06-01",
      lastModified: "2024-06-22",
      usage: 25,
      success: 93,
      stage: "Introduction"
    }
  ];

  const lifecycleStages = [
    { stage: "Introduction", templates: 3, description: "New templates in first 30 days" },
    { stage: "Growth", templates: 12, description: "Gaining adoption and feedback" },
    { stage: "Mature", templates: 28, description: "Stable, high-performing templates" },
    { stage: "Review", templates: 4, description: "Under evaluation for improvements" }
  ];

  const usageOverTime = [
    { month: "Jan", new: 2, active: 8, review: 1, retired: 0 },
    { month: "Feb", new: 3, active: 12, review: 2, retired: 1 },
    { month: "Mar", new: 4, active: 18, review: 2, retired: 0 },
    { month: "Apr", new: 2, active: 23, review: 3, retired: 1 },
    { month: "May", new: 5, active: 28, review: 4, retired: 2 },
    { month: "Jun", new: 3, active: 32, review: 4, retired: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "New": return "secondary";
      case "Under Review": return "destructive";
      default: return "default";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Introduction": return "bg-blue-100 text-blue-800";
      case "Growth": return "bg-green-100 text-green-800";
      case "Mature": return "bg-purple-100 text-purple-800";
      case "Review": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Lifecycle Stage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lifecycleStages.map((stage, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stage.stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stage.templates}</div>
              <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Lifecycle Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Template Lifecycle Timeline</CardTitle>
          <CardDescription>Template status distribution over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="new" stroke="#3B82F6" name="New Templates" strokeWidth={2} />
              <Line type="monotone" dataKey="active" stroke="#10B981" name="Active Templates" strokeWidth={2} />
              <Line type="monotone" dataKey="review" stroke="#F59E0B" name="Under Review" strokeWidth={2} />
              <Line type="monotone" dataKey="retired" stroke="#EF4444" name="Retired" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Template Lifecycles */}
      <Card>
        <CardHeader>
          <CardTitle>Template Lifecycle Details</CardTitle>
          <CardDescription>Individual template tracking and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templateLifecycles.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {new Date(template.created).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Modified: {new Date(template.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getStatusColor(template.status)}>{template.status}</Badge>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(template.stage)}`}>
                      {template.stage}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm">
                      <strong>{template.usage}</strong> uses
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">
                      <strong>{template.success}%</strong> success rate
                    </span>
                  </div>
                </div>

                {/* Success Rate Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Success Rate</span>
                    <span>{template.success}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${template.success >= 90 ? 'bg-green-500' : template.success >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${template.success}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateLifecycleView;
