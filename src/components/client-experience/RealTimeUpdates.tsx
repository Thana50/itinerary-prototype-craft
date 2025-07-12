
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Info,
  X,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RealTimeUpdate {
  id: string;
  type: 'booking_confirmed' | 'negotiation_update' | 'schedule_change' | 'weather_alert' | 'general_info';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  actionUrl?: string;
}

interface RealTimeUpdatesProps {
  itineraryId?: string;
}

const RealTimeUpdates = ({ itineraryId }: RealTimeUpdatesProps) => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([
    {
      id: '1',
      type: 'booking_confirmed',
      title: 'Hotel Booking Confirmed',
      message: 'Your reservation at Marriott Resort Phuket has been confirmed for March 15-20.',
      timestamp: '2 minutes ago',
      priority: 'high',
      isRead: false
    },
    {
      id: '2',
      type: 'negotiation_update',
      title: 'Price Negotiation Update',
      message: 'Great news! We secured a 15% discount on your island hopping tour.',
      timestamp: '1 hour ago',
      priority: 'medium',
      isRead: false
    },
    {
      id: '3',
      type: 'schedule_change',
      title: 'Flight Time Updated',
      message: 'Your departure flight has been moved to 2:30 PM (originally 1:15 PM).',
      timestamp: '3 hours ago',
      priority: 'high',
      isRead: true
    },
    {
      id: '4',
      type: 'weather_alert',
      title: 'Weather Update',
      message: 'Perfect weather expected during your stay - sunny skies and 30°C!',
      timestamp: '1 day ago',
      priority: 'low',
      isRead: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const getUpdateIcon = (type: RealTimeUpdate['type']) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negotiation_update':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'schedule_change':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'weather_alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: RealTimeUpdate['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === id ? { ...update, isRead: true } : update
    ));
  };

  const markAllAsRead = () => {
    setUpdates(prev => prev.map(update => ({ ...update, isRead: true })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const dismissUpdate = (id: string) => {
    setUpdates(prev => prev.filter(update => update.id !== id));
  };

  const filteredUpdates = updates.filter(update => {
    switch (filter) {
      case 'unread':
        return !update.isRead;
      case 'high':
        return update.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = updates.filter(update => !update.isRead).length;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new update
      if (Math.random() > 0.9) { // 10% chance every 5 seconds
        const newUpdate: RealTimeUpdate = {
          id: Date.now().toString(),
          type: 'general_info',
          title: 'New Update',
          message: 'Your travel agent has added a new activity to your itinerary.',
          timestamp: 'Just now',
          priority: 'medium',
          isRead: false
        };
        
        setUpdates(prev => [newUpdate, ...prev]);
        
        if (showNotifications) {
          toast({
            title: newUpdate.title,
            description: newUpdate.message,
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [showNotifications, toast]);

  return (
    <div className="space-y-4">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Real-time Updates
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {showNotifications ? 'Disable' : 'Enable'} Notifications
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({updates.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High Priority ({updates.filter(u => u.priority === 'high').length})
            </Button>
          </div>

          {/* Updates List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No updates to show</p>
              </div>
            ) : (
              filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    !update.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getUpdateIcon(update.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{update.title}</h4>
                          <Badge 
                            className={`${getPriorityColor(update.priority)} text-white text-xs`}
                          >
                            {update.priority}
                          </Badge>
                          {!update.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{update.message}</p>
                        <p className="text-sm text-gray-500">{update.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!update.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(update.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissUpdate(update.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeUpdates;
