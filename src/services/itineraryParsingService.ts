import { supabase } from '@/integrations/supabase/client';
import { marketIntelligenceService } from './marketIntelligenceService';
import { vendorMatchingService } from './vendorMatchingService';
import type { Itinerary } from '@/lib/supabase';

export interface ParsedItineraryItem {
  day_number: number;
  service_name: string;
  item_type: string;
  description: string;
  location: string;
  duration_hours: number;
  participants: number;
  estimated_price: number;
  market_rate_reference: number;
  suggested_vendors: string[];
  is_negotiable: boolean;
  negotiation_priority: 'low' | 'medium' | 'high';
}

class ItineraryParsingService {
  /**
   * Parse itinerary days into individual negotiable items
   */
  async parseItineraryToItems(itinerary: Itinerary): Promise<ParsedItineraryItem[]> {
    const items: ParsedItineraryItem[] = [];
    
    for (const day of itinerary.days) {
      const dayItems = await this.parseDayActivities(
        day.day,
        day.activities,
        itinerary.destination,
        itinerary.number_of_travelers
      );
      items.push(...dayItems);
    }
    
    return items;
  }

  /**
   * Parse activities for a specific day
   */
  private async parseDayActivities(
    dayNumber: number,
    activities: string[],
    destination: string,
    travelers: number
  ): Promise<ParsedItineraryItem[]> {
    const items: ParsedItineraryItem[] = [];
    
    for (const activity of activities) {
      const parsedItem = await this.parseActivity(
        dayNumber,
        activity,
        destination,
        travelers
      );
      
      if (parsedItem) {
        items.push(parsedItem);
      }
    }
    
    return items;
  }

  /**
   * Parse individual activity into negotiable item
   */
  private async parseActivity(
    dayNumber: number,
    activity: string,
    destination: string,
    travelers: number
  ): Promise<ParsedItineraryItem | null> {
    // Extract service type and details from activity description
    const serviceInfo = this.extractServiceInfo(activity);
    
    if (!serviceInfo.isNegotiable) {
      return null; // Skip non-negotiable items like "Free time"
    }

    // Get market intelligence for pricing
    const marketData = await marketIntelligenceService.getPricingRecommendation(
      serviceInfo.serviceType,
      destination,
      100, // base estimate
      travelers
    );

    // Get suggested vendors
    const vendors = await vendorMatchingService.findMatchingVendors(
      serviceInfo.serviceType,
      destination,
      { participants: travelers }
    );

    // Calculate estimated price based on market data and group size
    const basePrice = marketData?.suggested_target || this.getDefaultPrice(serviceInfo.serviceType);
    const groupSizeMultiplier = this.calculateGroupSizeMultiplier(travelers, serviceInfo.serviceType);
    const estimatedPrice = Math.round(basePrice * groupSizeMultiplier);

    return {
      day_number: dayNumber,
      service_name: serviceInfo.serviceName,
      item_type: serviceInfo.serviceType,
      description: activity,
      location: destination,
      duration_hours: serviceInfo.estimatedDuration,
      participants: travelers,
      estimated_price: estimatedPrice,
      market_rate_reference: marketData?.market_rate || basePrice,
      suggested_vendors: vendors.map(v => v.vendor.user_id),
      is_negotiable: true,
      negotiation_priority: this.determinePriority(estimatedPrice, serviceInfo.serviceType)
    };
  }

  /**
   * Extract service information from activity description
   */
  private extractServiceInfo(activity: string): {
    serviceName: string;
    serviceType: string;
    estimatedDuration: number;
    isNegotiable: boolean;
  } {
    const activityLower = activity.toLowerCase();
    
    // Transportation
    if (activityLower.includes('transfer') || activityLower.includes('pickup') || activityLower.includes('transport')) {
      return {
        serviceName: activity,
        serviceType: 'transportation',
        estimatedDuration: 1,
        isNegotiable: true
      };
    }
    
    // Tours & Activities
    if (activityLower.includes('tour') || activityLower.includes('visit') || activityLower.includes('excursion')) {
      return {
        serviceName: activity,
        serviceType: 'tours',
        estimatedDuration: 4,
        isNegotiable: true
      };
    }
    
    // Accommodation (usually pre-negotiated, but can be optimized)
    if (activityLower.includes('hotel') || activityLower.includes('resort') || activityLower.includes('accommodation')) {
      return {
        serviceName: activity,
        serviceType: 'accommodation',
        estimatedDuration: 24,
        isNegotiable: true
      };
    }
    
    // Dining
    if (activityLower.includes('dinner') || activityLower.includes('lunch') || activityLower.includes('restaurant')) {
      return {
        serviceName: activity,
        serviceType: 'dining',
        estimatedDuration: 2,
        isNegotiable: true
      };
    }
    
    // Activities & Entertainment
    if (activityLower.includes('show') || activityLower.includes('spa') || activityLower.includes('activity')) {
      return {
        serviceName: activity,
        serviceType: 'activities',
        estimatedDuration: 3,
        isNegotiable: true
      };
    }
    
    // Default - treat as general activity
    if (activityLower.includes('free time') || activityLower.includes('leisure') || activityLower.includes('rest')) {
      return {
        serviceName: activity,
        serviceType: 'leisure',
        estimatedDuration: 2,
        isNegotiable: false
      };
    }
    
    return {
      serviceName: activity,
      serviceType: 'activities',
      estimatedDuration: 2,
      isNegotiable: true
    };
  }

  /**
   * Get default pricing for service types
   */
  private getDefaultPrice(serviceType: string): number {
    const defaultPrices: Record<string, number> = {
      transportation: 50,
      tours: 120,
      accommodation: 200,
      dining: 80,
      activities: 100,
      leisure: 0
    };
    
    return defaultPrices[serviceType] || 75;
  }

  /**
   * Calculate group size multiplier for pricing
   */
  private calculateGroupSizeMultiplier(travelers: number, serviceType: string): number {
    // Some services scale per person, others have group rates
    const perPersonServices = ['dining', 'activities', 'tours'];
    const groupRateServices = ['transportation', 'accommodation'];
    
    if (perPersonServices.includes(serviceType)) {
      return travelers;
    } else if (groupRateServices.includes(serviceType)) {
      // Group rates with diminishing returns
      return Math.max(1, 1 + (travelers - 1) * 0.7);
    }
    
    return travelers;
  }

  /**
   * Determine negotiation priority based on price and service type
   */
  private determinePriority(estimatedPrice: number, serviceType: string): 'low' | 'medium' | 'high' {
    // High-value services get higher priority
    const highValueServices = ['accommodation', 'tours'];
    const mediumValueServices = ['transportation', 'activities'];
    
    if (estimatedPrice > 300 || highValueServices.includes(serviceType)) {
      return 'high';
    } else if (estimatedPrice > 100 || mediumValueServices.includes(serviceType)) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Save parsed items to database
   */
  async saveItemsToDatabase(itineraryId: string, items: ParsedItineraryItem[]): Promise<void> {
    const itemsToInsert = items.map(item => ({
      ...item,
      itinerary_id: itineraryId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('itinerary_items')
      .insert(itemsToInsert);

    if (error) {
      console.error('Error saving itinerary items:', error);
      throw error;
    }
  }

  /**
   * Main function to auto-parse approved itinerary
   */
  async autoParseApprovedItinerary(itineraryId: string): Promise<{
    success: boolean;
    itemsCreated: number;
    estimatedValue: number;
  }> {
    try {
      // Get the itinerary
      const { data: itinerary, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .single();

      if (error || !itinerary) {
        throw new Error('Itinerary not found');
      }

      // Check if items already exist for this itinerary
      const { data: existingItems } = await supabase
        .from('itinerary_items')
        .select('id')
        .eq('itinerary_id', itineraryId);

      if (existingItems && existingItems.length > 0) {
        console.log('Items already exist for this itinerary');
        return {
          success: true,
          itemsCreated: existingItems.length,
          estimatedValue: 0
        };
      }

      // Parse itinerary into items
      const parsedItems = await this.parseItineraryToItems({
        ...itinerary,
        status: itinerary.status as 'draft' | 'shared' | 'confirmed' | 'modified',
        days: itinerary.days as any
      });

      // Save items to database
      await this.saveItemsToDatabase(itineraryId, parsedItems);

      // Calculate total estimated value
      const estimatedValue = parsedItems.reduce((sum, item) => sum + item.estimated_price, 0);

      console.log(`Successfully parsed itinerary ${itineraryId}: ${parsedItems.length} items, $${estimatedValue} estimated value`);

      return {
        success: true,
        itemsCreated: parsedItems.length,
        estimatedValue
      };
    } catch (error) {
      console.error('Error auto-parsing itinerary:', error);
      return {
        success: false,
        itemsCreated: 0,
        estimatedValue: 0
      };
    }
  }
}

export const itineraryParsingService = new ItineraryParsingService();