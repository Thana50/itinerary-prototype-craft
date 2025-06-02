
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock } from "lucide-react";

interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

interface ModificationTrackingProps {
  modifications: Modification[];
}

const ModificationTracking = ({ modifications }: ModificationTrackingProps) => {
  if (modifications.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-600" />
            Changes Made
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            No changes made yet. Start customizing your trip by chatting with our AI!
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    return timestamp.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <History className="h-5 w-5 mr-2 text-blue-600" />
          Changes Made
          <Badge variant="outline" className="ml-2 text-xs">
            {modifications.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {modifications.map((modification) => (
          <div 
            key={modification.id} 
            className="flex items-start justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {modification.description}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeAgo(modification.timestamp)}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="text-green-600 border-green-200 bg-green-50 ml-3"
            >
              +${modification.priceChange * 4}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ModificationTracking;
