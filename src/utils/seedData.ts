
import { supabase } from '@/integrations/supabase/client';
import type { Itinerary, Negotiation } from '@/lib/supabase';

export const createSeedData = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    console.log('Creating seed data for user:', user.id);

    // Sample itineraries
    const sampleItineraries = [
      {
        agent_id: user.id,
        name: 'European Adventure',
        destination: 'France, Italy, Spain',
        start_date: '2025-06-15',
        end_date: '2025-06-30',
        number_of_travelers: 2,
        preferences: 'Cultural sites, fine dining, romantic settings',
        status: 'draft' as const,
        days: [
          { day: 1, title: 'Arrival in Paris', activities: ['Airport pickup', 'Hotel check-in', 'Evening Seine cruise'] },
          { day: 2, title: 'Paris Exploration', activities: ['Louvre Museum', 'Eiffel Tower', 'Montmartre district'] },
          { day: 3, title: 'Travel to Rome', activities: ['Flight to Rome', 'Colosseum tour', 'Traditional Roman dinner'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Asian Exploration',
        destination: 'Japan, Thailand',
        start_date: '2025-09-05',
        end_date: '2025-09-20',
        number_of_travelers: 1,
        preferences: 'Cultural immersion, temples, local cuisine',
        status: 'shared' as const,
        days: [
          { day: 1, title: 'Tokyo Arrival', activities: ['Airport transfer', 'Hotel check-in', 'Shibuya exploration'] },
          { day: 2, title: 'Traditional Tokyo', activities: ['Senso-ji Temple', 'Traditional breakfast', 'Imperial Palace'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Caribbean Getaway',
        destination: 'Jamaica, Bahamas',
        start_date: '2025-07-10',
        end_date: '2025-07-17',
        number_of_travelers: 2,
        preferences: 'Beach relaxation, water sports, luxury resorts',
        status: 'confirmed' as const,
        days: [
          { day: 1, title: 'Jamaica Arrival', activities: ['Airport pickup', 'Resort check-in', 'Beach time'] },
          { day: 2, title: 'Water Adventures', activities: ['Snorkeling tour', 'Jet skiing', 'Sunset dinner'] }
        ]
      }
    ];

    // Create itineraries
    const createdItineraries: Itinerary[] = [];
    for (const itinerary of sampleItineraries) {
      const { data, error } = await supabase
        .from('itineraries')
        .insert(itinerary)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating itinerary:', error);
        continue;
      }
      
      if (data) {
        createdItineraries.push({
          ...data,
          status: data.status as 'draft' | 'shared' | 'confirmed' | 'modified',
          days: (data.days as any) || []
        } as Itinerary);
      }
    }

    console.log('Created itineraries:', createdItineraries.length);

    // Sample negotiations (need a vendor user ID - for demo, we'll use the same user)
    const sampleNegotiations = [
      {
        itinerary_id: createdItineraries[0]?.id || '',
        agent_id: user.id,
        vendor_id: user.id, // In real scenario, this would be a different vendor user
        service_type: 'Hotel Accommodation',
        description: 'Luxury hotel booking for 2 guests in Paris for 3 nights',
        status: 'pending' as const,
        messages: []
      },
      {
        itinerary_id: createdItineraries[1]?.id || '',
        agent_id: user.id,
        vendor_id: user.id,
        service_type: 'Flight Booking',
        description: 'Round-trip flights to Tokyo for 1 passenger',
        status: 'negotiating' as const,
        messages: [
          {
            id: '1',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Looking for competitive rates for Tokyo flights',
            price_offer: 1200,
            created_at: new Date().toISOString()
          }
        ]
      }
    ];

    // Create negotiations only if we have itineraries
    if (createdItineraries.length > 0) {
      for (const negotiation of sampleNegotiations) {
        if (!negotiation.itinerary_id) continue;
        
        const { data, error } = await supabase
          .from('negotiations')
          .insert(negotiation)
          .select()
          .single();
        
        if (error) {
          console.error('Error creating negotiation:', error);
          continue;
        }
        
        console.log('Created negotiation:', data?.id);
      }
    }

    return {
      success: true,
      message: `Successfully created ${createdItineraries.length} itineraries and ${sampleNegotiations.length} negotiations`
    };
    
  } catch (error) {
    console.error('Error creating seed data:', error);
    return {
      success: false,
      message: `Error creating seed data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
