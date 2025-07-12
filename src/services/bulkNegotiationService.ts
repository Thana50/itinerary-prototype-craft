import { supabase } from '@/integrations/supabase/client';
import { itineraryParsingService } from './itineraryParsingService';
import { negotiationService } from './negotiationService';
import { vendorMatchingService } from './vendorMatchingService';
import { notificationService } from './notificationService';
import type { Negotiation } from '@/lib/supabase';

export interface BulkNegotiationRequest {
  itineraryId: string;
  selectedItems: string[];
  agentId: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  autoApprovalThreshold?: number;
}

export interface BulkNegotiationResult {
  success: boolean;
  negotiationsCreated: number;
  estimatedSavings: number;
  negotiationIds: string[];
  errors?: string[];
}

class BulkNegotiationService {
  /**
   * Create multiple negotiations from selected itinerary items
   */
  async createBulkNegotiations(request: BulkNegotiationRequest): Promise<BulkNegotiationResult> {
    try {
      console.log('Creating bulk negotiations for:', request);

      // Get the selected itinerary items
      const { data: items, error: itemsError } = await supabase
        .from('itinerary_items')
        .select('*')
        .in('id', request.selectedItems)
        .eq('itinerary_id', request.itineraryId);

      if (itemsError) {
        throw itemsError;
      }

      if (!items || items.length === 0) {
        return {
          success: false,
          negotiationsCreated: 0,
          estimatedSavings: 0,
          negotiationIds: [],
          errors: ['No valid items found for negotiation']
        };
      }

      const negotiations: Negotiation[] = [];
      const errors: string[] = [];
      let totalEstimatedSavings = 0;

      // Create negotiation for each item
      for (const item of items) {
        try {
          // Find best vendor for this item
          const vendors = await vendorMatchingService.findMatchingVendors(
            item.item_type,
            item.location || 'Phuket, Thailand',
            {
              participants: item.participants || 1,
              priority: request.priority
            }
          );

          if (vendors.length === 0) {
            errors.push(`No vendors found for ${item.service_name}`);
            continue;
          }

          // Use the top-rated vendor
          const selectedVendor = vendors[0];

          // Calculate target price (aim for 15-25% discount)
          const discountPercent = this.calculateTargetDiscount(item.estimated_price || 0, item.item_type);
          const targetPrice = Math.round((item.estimated_price || 0) * (1 - discountPercent / 100));
          
          // Create the negotiation
          const negotiation = await negotiationService.createNegotiation({
            itinerary_id: request.itineraryId,
            itinerary_item_id: item.id,
            agent_id: request.agentId,
            vendor_id: selectedVendor.vendor.user_id,
            service_type: item.item_type,
            description: item.service_name,
            status: 'pending',
            original_price: item.estimated_price,
            target_price: targetPrice,
            negotiation_priority: request.priority,
            auto_approval_threshold: request.autoApprovalThreshold,
            negotiation_deadline: request.deadline
          });

          negotiations.push(negotiation);
          totalEstimatedSavings += (item.estimated_price || 0) - targetPrice;

          // Create notification for vendor
          await notificationService.createNotification(
            selectedVendor.vendor.user_id,
            'New Rate Negotiation Request',
            `New negotiation request for ${item.service_name}`,
            'negotiation_request'
          );

        } catch (itemError) {
          console.error(`Error creating negotiation for item ${item.id}:`, itemError);
          errors.push(`Failed to create negotiation for ${item.service_name}: ${itemError.message}`);
        }
      }

      // Create notification for agent about bulk negotiation completion
      if (negotiations.length > 0) {
        await notificationService.createNotification(
          request.agentId,
          'Bulk Negotiations Initiated',
          `Successfully created ${negotiations.length} negotiations with estimated savings of $${totalEstimatedSavings}`,
          'negotiation_update'
        );
      }

      return {
        success: true,
        negotiationsCreated: negotiations.length,
        estimatedSavings: totalEstimatedSavings,
        negotiationIds: negotiations.map(n => n.id),
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('Error in bulk negotiation creation:', error);
      return {
        success: false,
        negotiationsCreated: 0,
        estimatedSavings: 0,
        negotiationIds: [],
        errors: [error.message || 'Unknown error occurred']
      };
    }
  }

  /**
   * Calculate target discount percentage based on price and service type
   */
  private calculateTargetDiscount(price: number, serviceType: string): number {
    // Base discount targets by service type
    const discountTargets: Record<string, number> = {
      accommodation: 20,    // Hotels often have more flexibility
      tours: 25,           // Tour operators usually have good margins
      transportation: 15,   // Transport has lower margins
      dining: 12,          // Restaurants have variable margins
      activities: 18       // Activities can vary widely
    };

    let baseDiscount = discountTargets[serviceType] || 15;

    // Adjust based on price tier (higher prices = more negotiation room)
    if (price > 500) {
      baseDiscount += 5; // Premium services have more margin
    } else if (price < 100) {
      baseDiscount -= 3; // Lower-priced services have less margin
    }

    // Ensure reasonable bounds
    return Math.max(10, Math.min(30, baseDiscount));
  }

  /**
   * Get bulk negotiation status for an itinerary
   */
  async getBulkNegotiationStatus(itineraryId: string, agentId: string): Promise<{
    totalNegotiations: number;
    pendingNegotiations: number;
    acceptedNegotiations: number;
    rejectedNegotiations: number;
    totalSavings: number;
    negotiations: Negotiation[];
  }> {
    try {
      const negotiations = await negotiationService.getAgentNegotiations(agentId);
      const itineraryNegotiations = negotiations.filter(n => n.itinerary_id === itineraryId);

      const pendingCount = itineraryNegotiations.filter(n => n.status === 'pending' || n.status === 'negotiating').length;
      const acceptedCount = itineraryNegotiations.filter(n => n.status === 'accepted').length;
      const rejectedCount = itineraryNegotiations.filter(n => n.status === 'rejected').length;

      const totalSavings = itineraryNegotiations
        .filter(n => n.status === 'accepted')
        .reduce((sum, n) => {
          const savings = (n.original_price || 0) - (n.final_price || n.target_price || 0);
          return sum + Math.max(0, savings);
        }, 0);

      return {
        totalNegotiations: itineraryNegotiations.length,
        pendingNegotiations: pendingCount,
        acceptedNegotiations: acceptedCount,
        rejectedNegotiations: rejectedCount,
        totalSavings,
        negotiations: itineraryNegotiations
      };

    } catch (error) {
      console.error('Error getting bulk negotiation status:', error);
      return {
        totalNegotiations: 0,
        pendingNegotiations: 0,
        acceptedNegotiations: 0,
        rejectedNegotiations: 0,
        totalSavings: 0,
        negotiations: []
      };
    }
  }
}

export const bulkNegotiationService = new BulkNegotiationService();