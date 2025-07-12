import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  entity_id?: string;
  entity_type?: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  created_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  high_priority: number;
  recent: number; // last 24 hours
}

export const notificationService = {
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    options: {
      entityId?: string;
      entityType?: string;
      priority?: 'low' | 'medium' | 'high';
      actionUrl?: string;
    } = {}
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        notification_type: type,
        title,
        message,
        entity_id: options.entityId,
        entity_type: options.entityType,
        priority: options.priority || 'medium',
        action_url: options.actionUrl,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async getUserNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data as Notification[];
  },

  async markAsRead(notificationIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', notificationIds);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  async getNotificationStats(userId: string): Promise<NotificationStats> {
    const { data: all } = await supabase
      .from('notifications')
      .select('id, is_read, priority, created_at')
      .eq('user_id', userId);

    if (!all) {
      return { total: 0, unread: 0, high_priority: 0, recent: 0 };
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      total: all.length,
      unread: all.filter(n => !n.is_read).length,
      high_priority: all.filter(n => n.priority === 'high' && !n.is_read).length,
      recent: all.filter(n => new Date(n.created_at) > twentyFourHoursAgo).length
    };
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Workflow-specific notification helpers
  async notifyItineraryApproved(agentId: string, itineraryId: string, itineraryName: string): Promise<void> {
    await this.createNotification(
      agentId,
      'itinerary_approved',
      'Itinerary Approved',
      `"${itineraryName}" has been approved by the traveler and is ready for rate negotiations.`,
      {
        entityId: itineraryId,
        entityType: 'itinerary',
        priority: 'high',
        actionUrl: `/agent-dashboard?approved=${itineraryId}`
      }
    );
  },

  async notifyNegotiationStarted(vendorId: string, negotiationId: string, serviceName: string): Promise<void> {
    await this.createNotification(
      vendorId,
      'negotiation_started',
      'New Rate Negotiation',
      `A new rate negotiation has been initiated for "${serviceName}". Please review and respond.`,
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'high',
        actionUrl: `/vendor-dashboard?negotiation=${negotiationId}`
      }
    );
  },

  async notifyNegotiationResponse(agentId: string, negotiationId: string, vendorName: string): Promise<void> {
    await this.createNotification(
      agentId,
      'negotiation_response',
      'Vendor Response Received',
      `${vendorName} has responded to your negotiation request. Review their offer.`,
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'medium',
        actionUrl: `/rate-negotiation-ai?active=${negotiationId}`
      }
    );
  },

  async notifyNegotiationAccepted(vendorId: string, negotiationId: string, finalPrice: number): Promise<void> {
    await this.createNotification(
      vendorId,
      'negotiation_accepted',
      'Negotiation Accepted',
      `Your offer of $${finalPrice.toFixed(2)} has been accepted. Congratulations!`,
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'high',
        actionUrl: `/vendor-dashboard?success=${negotiationId}`
      }
    );
  },

  async notifyNegotiationRejected(vendorId: string, negotiationId: string): Promise<void> {
    await this.createNotification(
      vendorId,
      'negotiation_rejected',
      'Negotiation Not Accepted',
      'Your recent offer was not accepted. You may receive a counter-offer soon.',
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'medium',
        actionUrl: `/vendor-dashboard?negotiation=${negotiationId}`
      }
    );
  },

  async notifyDeadlineApproaching(userId: string, negotiationId: string, hoursRemaining: number): Promise<void> {
    await this.createNotification(
      userId,
      'deadline_approaching',
      'Negotiation Deadline Approaching',
      `A negotiation deadline is approaching in ${hoursRemaining} hours. Please take action soon.`,
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'high',
        actionUrl: `/rate-negotiation-ai?urgent=${negotiationId}`
      }
    );
  },

  async notifyAiRecommendation(agentId: string, negotiationId: string, confidence: number): Promise<void> {
    await this.createNotification(
      agentId,
      'ai_recommendation',
      'AI Strategy Recommendation',
      `New AI analysis available with ${confidence}% confidence. Review recommended actions.`,
      {
        entityId: negotiationId,
        entityType: 'negotiation',
        priority: 'medium',
        actionUrl: `/rate-negotiation-ai?tab=ai-intelligence&focus=${negotiationId}`
      }
    );
  },

  // Real-time subscription helper
  subscribeToUserNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  }
};