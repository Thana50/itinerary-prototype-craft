import { supabase } from '@/integrations/supabase/client';

export interface ItineraryItem {
  id: string;
  itinerary_id: string;
  day_number: number;
  item_type: 'accommodation' | 'transportation' | 'activity' | 'dining' | 'guide';
  service_name: string;
  description?: string;
  estimated_price?: number;
  assigned_vendor_id?: string;
  suggested_vendors?: string[];
  location?: string;
  duration_hours?: number;
  participants: number;
  special_requirements: Record<string, any>;
  negotiation_priority: 'low' | 'medium' | 'high';
  is_negotiable: boolean;
  market_rate_reference?: number;
  created_at: string;
  updated_at: string;
}

export const itineraryItemService = {
  async parseItineraryIntoItems(itineraryId: string): Promise<ItineraryItem[]> {
    // Get the itinerary with its days data
    const { data: itinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', itineraryId)
      .single();

    if (itineraryError) throw itineraryError;

    // Check if items already exist for this itinerary
    const { data: existingItems } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('itinerary_id', itineraryId);

    if (existingItems && existingItems.length > 0) {
      return existingItems as ItineraryItem[];
    }

    // Parse days into individual items
    const days = Array.isArray(itinerary.days) ? itinerary.days : [];
    const items: Omit<ItineraryItem, 'id' | 'created_at' | 'updated_at'>[] = [];

    for (const dayData of days) {
      const day = dayData as any; // Type assertion for JSONB data
      const dayNumber = day.day || 1;
      const activities = Array.isArray(day.activities) ? day.activities : [];

      // Create accommodation item for each day
      items.push({
        itinerary_id: itineraryId,
        day_number: dayNumber,
        item_type: 'accommodation',
        service_name: `Accommodation - Day ${dayNumber}`,
        description: `Hotel/lodging for ${day.title || `Day ${dayNumber}`}`,
        estimated_price: 120.00,
        location: itinerary.destination,
        participants: itinerary.number_of_travelers,
        special_requirements: {},
        negotiation_priority: 'high',
        is_negotiable: true
      });

      // Create activity items
      activities.forEach((activity: string, index: number) => {
        items.push({
          itinerary_id: itineraryId,
          day_number: dayNumber,
          item_type: 'activity',
          service_name: activity,
          description: `${activity} on ${day.title || `Day ${dayNumber}`}`,
          estimated_price: 75.00,
          location: itinerary.destination,
          duration_hours: 4,
          participants: itinerary.number_of_travelers,
          special_requirements: {},
          negotiation_priority: 'medium',
          is_negotiable: true
        });
      });

      // Add transportation if not the first day
      if (dayNumber > 1) {
        items.push({
          itinerary_id: itineraryId,
          day_number: dayNumber,
          item_type: 'transportation',
          service_name: `Transportation - Day ${dayNumber}`,
          description: `Transport services for Day ${dayNumber}`,
          estimated_price: 50.00,
          location: itinerary.destination,
          participants: itinerary.number_of_travelers,
          special_requirements: {},
          negotiation_priority: 'low',
          is_negotiable: true
        });
      }
    }

    // Insert items into database
    const { data: insertedItems, error: insertError } = await supabase
      .from('itinerary_items')
      .insert(items)
      .select();

    if (insertError) throw insertError;

    return insertedItems as ItineraryItem[];
  },

  async getItineraryItems(itineraryId: string): Promise<ItineraryItem[]> {
    const { data, error } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .order('day_number', { ascending: true });

    if (error) throw error;
    return data as ItineraryItem[];
  },

  async updateItem(itemId: string, updates: Partial<ItineraryItem>): Promise<ItineraryItem> {
    const { data, error } = await supabase
      .from('itinerary_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data as ItineraryItem;
  },

  async assignVendorToItem(itemId: string, vendorId: string): Promise<ItineraryItem> {
    return this.updateItem(itemId, { assigned_vendor_id: vendorId });
  },

  async getNegotiableItems(itineraryId: string): Promise<ItineraryItem[]> {
    const { data, error } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .eq('is_negotiable', true)
      .order('negotiation_priority', { ascending: false });

    if (error) throw error;
    return data as ItineraryItem[];
  },

  async updateMarketReference(itemId: string, marketRate: number): Promise<void> {
    const { error } = await supabase
      .from('itinerary_items')
      .update({ market_rate_reference: marketRate })
      .eq('id', itemId);

    if (error) throw error;
  }
};