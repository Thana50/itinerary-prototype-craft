import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, Notification, NotificationStats } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    high_priority: 0,
    recent: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [notificationData, statsData] = await Promise.all([
        notificationService.getUserNotifications(user.id, { limit: 50 }),
        notificationService.getNotificationStats(user.id)
      ]);
      
      setNotifications(notificationData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!user?.id) return;

    try {
      await notificationService.markAsRead(notificationIds);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Update stats
      const unreadDecrement = notificationIds.length;
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - unreadDecrement)
      }));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setStats(prev => ({ ...prev, unread: 0 }));
      
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  const showNewNotificationToast = useCallback((notification: Notification) => {
    const isPriorityHigh = notification.priority === 'high';
    
    toast({
      title: notification.title,
      description: notification.message,
      variant: isPriorityHigh ? "destructive" : "default"
    });
  }, [toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = notificationService.subscribeToUserNotifications(
      user.id,
      (newNotification) => {
        // Add new notification to list
        setNotifications(prev => [newNotification, ...prev]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          unread: prev.unread + 1,
          high_priority: newNotification.priority === 'high' && !newNotification.is_read 
            ? prev.high_priority + 1 
            : prev.high_priority,
          recent: prev.recent + 1
        }));

        // Show toast for new notification
        showNewNotificationToast(newNotification);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, showNewNotificationToast]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};