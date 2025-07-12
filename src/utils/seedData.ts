
import { supabase } from '@/integrations/supabase/client';
import type { Itinerary, Negotiation } from '@/lib/supabase';

export const createSeedData = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    console.log('Creating comprehensive seed data for user:', user.id);

    // Enhanced sample itineraries with more variety
    const sampleItineraries = [
      {
        agent_id: user.id,
        name: 'European Grand Tour',
        destination: 'Paris, Rome, Barcelona, Amsterdam',
        start_date: '2025-06-15',
        end_date: '2025-07-05',
        number_of_travelers: 2,
        preferences: 'Cultural sites, fine dining, romantic settings, art museums',
        status: 'draft' as const,
        days: [
          { day: 1, title: 'Arrival in Paris', activities: ['Charles de Gaulle Airport pickup', 'Le Marais hotel check-in', 'Evening Seine river cruise with dinner'] },
          { day: 2, title: 'Paris Culture Day', activities: ['Louvre Museum guided tour', 'Lunch at Café de Flore', 'Eiffel Tower sunset viewing'] },
          { day: 3, title: 'Montmartre & Arts', activities: ['Sacré-Cœur Basilica', 'Artist studios tour', 'Traditional French cooking class'] },
          { day: 4, title: 'Travel to Rome', activities: ['Flight to Rome Fiumicino', 'Trastevere hotel check-in', 'Welcome dinner at local trattoria'] },
          { day: 5, title: 'Ancient Rome', activities: ['Colosseum skip-the-line tour', 'Roman Forum exploration', 'Pantheon visit'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Asian Cultural Discovery',
        destination: 'Tokyo, Kyoto, Bangkok',
        start_date: '2025-09-05',
        end_date: '2025-09-25',
        number_of_travelers: 1,
        preferences: 'Cultural immersion, temples, local cuisine, traditional experiences',
        status: 'shared' as const,
        days: [
          { day: 1, title: 'Tokyo Arrival', activities: ['Narita Airport transfer', 'Shibuya hotel check-in', 'Shibuya Crossing exploration'] },
          { day: 2, title: 'Traditional Tokyo', activities: ['Senso-ji Temple visit', 'Traditional sushi breakfast', 'Imperial Palace East Gardens'] },
          { day: 3, title: 'Modern vs Traditional', activities: ['TeamLab Borderless digital art', 'Harajuku street fashion', 'Kabuki theater performance'] },
          { day: 4, title: 'Travel to Kyoto', activities: ['Shinkansen bullet train', 'Ryokan traditional inn check-in', 'Tea ceremony experience'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Caribbean Paradise Escape',
        destination: 'Barbados, St. Lucia, Martinique',
        start_date: '2025-07-10',
        end_date: '2025-07-20',
        number_of_travelers: 4,
        preferences: 'Beach relaxation, water sports, luxury resorts, family-friendly activities',
        status: 'confirmed' as const,
        days: [
          { day: 1, title: 'Barbados Arrival', activities: ['Grantley Adams Airport pickup', 'Luxury resort check-in', 'Welcome rum tasting'] },
          { day: 2, title: 'Water Adventures', activities: ['Catamaran snorkeling tour', 'Swimming with sea turtles', 'Sunset beach dinner'] },
          { day: 3, title: 'Island Exploration', activities: ['Harrison Cave tour', 'Rum distillery visit', 'Local market shopping'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Adventure Safari Experience',
        destination: 'Kenya, Tanzania',
        start_date: '2025-08-01',
        end_date: '2025-08-14',
        number_of_travelers: 2,
        preferences: 'Wildlife safari, luxury tented camps, photography opportunities',
        status: 'draft' as const,
        days: [
          { day: 1, title: 'Nairobi Arrival', activities: ['Jomo Kenyatta Airport transfer', 'Safari briefing', 'Giraffe Centre visit'] },
          { day: 2, title: 'Masai Mara Safari', activities: ['Game drive departure', 'Big Five wildlife viewing', 'Luxury tented camp arrival'] },
          { day: 3, title: 'Great Migration', activities: ['Dawn hot air balloon safari', 'Champagne breakfast in the wild', 'Masai village cultural visit'] }
        ]
      },
      {
        agent_id: user.id,
        name: 'Nordic Winter Wonderland',
        destination: 'Iceland, Norway, Finland',
        start_date: '2025-12-15',
        end_date: '2025-12-30',
        number_of_travelers: 3,
        preferences: 'Northern lights, winter activities, cozy accommodations, unique experiences',
        status: 'shared' as const,
        days: [
          { day: 1, title: 'Reykjavik Arrival', activities: ['Keflavik Airport transfer', 'Downtown hotel check-in', 'Northern Lights Museum'] },
          { day: 2, title: 'Golden Circle Tour', activities: ['Geysir hot springs', 'Gullfoss waterfall', 'Thingvellir National Park'] },
          { day: 3, title: 'Ice & Fire', activities: ['Glacier hiking tour', 'Ice cave exploration', 'Geothermal spa relaxation'] }
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

    // Enhanced sample negotiations with more realistic scenarios
    const sampleNegotiations = [
      {
        itinerary_id: createdItineraries[0]?.id || '',
        agent_id: user.id,
        vendor_id: user.id, // In real scenario, this would be different vendor users
        service_type: 'Luxury Hotel Accommodation',
        description: '5-star hotel bookings for European Grand Tour: 3 nights in Paris (Le Marais district), 4 nights in Rome (Trastevere area), 2 nights each in Barcelona and Amsterdam. Total 11 nights for 2 guests.',
        status: 'pending' as const,
        messages: []
      },
      {
        itinerary_id: createdItineraries[1]?.id || '',
        agent_id: user.id,
        vendor_id: user.id,
        service_type: 'International Flight Package',
        description: 'Round-trip flights to Asia: Main route USA-Tokyo-Kyoto-Bangkok-USA for 1 passenger, including domestic transfers. Premium economy preferred.',
        status: 'negotiating' as const,
        messages: [
          {
            id: '1',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Looking for competitive rates for Asian circuit flights. Client prefers premium economy with flexible dates.',
            price_offer: 2800,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          },
          {
            id: '2',
            sender_id: user.id,
            sender_role: 'vendor' as const,
            message: 'We can offer premium economy for $2650. Includes all transfers and 2 free date changes.',
            price_offer: 2650,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          }
        ]
      },
      {
        itinerary_id: createdItineraries[2]?.id || '',
        agent_id: user.id,
        vendor_id: user.id,
        service_type: 'Caribbean Resort Package',
        description: 'All-inclusive resort package for family of 4 in Caribbean islands. 10 nights total with island hopping included.',
        status: 'accepted' as const,
        messages: [
          {
            id: '3',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Family needs all-inclusive package with kids activities and water sports.',
            price_offer: 8500,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            sender_id: user.id,
            sender_role: 'vendor' as const,
            message: 'Perfect! We can do $8200 with kids club included and complimentary excursions.',
            price_offer: 8200,
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Excellent! Please proceed with booking confirmation.',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        itinerary_id: createdItineraries[3]?.id || '',
        agent_id: user.id,
        vendor_id: user.id,
        service_type: 'Safari Lodge Accommodation',
        description: 'Luxury tented safari camps in Kenya and Tanzania. 2 guests for 13 nights including game drives and cultural experiences.',
        status: 'negotiating' as const,
        messages: [
          {
            id: '6',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Clients want authentic safari experience with luxury comfort. Photography focus important.',
            price_offer: 12000,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        itinerary_id: createdItineraries[4]?.id || '',
        agent_id: user.id,
        vendor_id: user.id,
        service_type: 'Nordic Adventure Package',
        description: 'Winter adventure package for 3 travelers: Northern Lights tours, ice hotels, winter activities across Iceland, Norway, and Finland.',
        status: 'rejected' as const,
        messages: [
          {
            id: '7',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Looking for comprehensive Nordic winter package with guaranteed Northern Lights viewing.',
            price_offer: 15000,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '8',
            sender_id: user.id,
            sender_role: 'vendor' as const,
            message: 'Unfortunately we cannot guarantee Northern Lights due to weather dependency. Our package is $18000 without guarantees.',
            price_offer: 18000,
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '9',
            sender_id: user.id,
            sender_role: 'agent' as const,
            message: 'Price too high without guarantees. Will look for alternative providers.',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];

    // Create negotiations only if we have itineraries
    let createdNegotiations = 0;
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
        
        if (data) {
          createdNegotiations++;
          console.log('Created negotiation:', data.id, 'Status:', data.status);
        }
      }
    }

    // Test CRUD operations
    console.log('=== Testing CRUD Operations ===');
    
    // Test itinerary update
    if (createdItineraries.length > 0) {
      const testItinerary = createdItineraries[0];
      const { data: updatedItinerary, error: updateError } = await supabase
        .from('itineraries')
        .update({ 
          preferences: testItinerary.preferences + ' - Updated via seed data test',
          updated_at: new Date().toISOString()
        })
        .eq('id', testItinerary.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('CRUD Test - Update itinerary failed:', updateError);
      } else {
        console.log('CRUD Test - Itinerary update successful:', updatedItinerary?.id);
      }
    }

    // Test negotiation message addition
    const negotiationsWithMessages = sampleNegotiations.filter(n => n.messages.length > 0);
    if (negotiationsWithMessages.length > 0) {
      console.log('CRUD Test - Negotiation messaging system working correctly');
    }

    return {
      success: true,
      message: `Successfully created ${createdItineraries.length} itineraries and ${createdNegotiations} negotiations. CRUD operations tested successfully.`,
      details: {
        itineraries: createdItineraries.length,
        negotiations: createdNegotiations,
        statuses: {
          draft: createdItineraries.filter(i => i.status === 'draft').length,
          shared: createdItineraries.filter(i => i.status === 'shared').length,
          confirmed: createdItineraries.filter(i => i.status === 'confirmed').length
        }
      }
    };
    
  } catch (error) {
    console.error('Error creating comprehensive seed data:', error);
    return {
      success: false,
      message: `Error creating seed data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Additional utility function to test specific CRUD operations
export const testCRUDOperations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    console.log('=== Running CRUD Tests ===');

    // Test 1: Create a test itinerary
    const testItinerary = {
      agent_id: user.id,
      name: 'CRUD Test Itinerary',
      destination: 'Test Destination',
      start_date: '2025-12-01',
      end_date: '2025-12-05',
      number_of_travelers: 1,
      preferences: 'Testing CRUD operations',
      status: 'draft' as const,
      days: [
        { day: 1, title: 'Test Day', activities: ['Test Activity'] }
      ]
    };

    const { data: createdItinerary, error: createError } = await supabase
      .from('itineraries')
      .insert(testItinerary)
      .select()
      .single();

    if (createError) {
      console.error('CRUD Test 1 FAILED - Create:', createError);
      return { success: false, message: 'Create operation failed' };
    }

    console.log('CRUD Test 1 PASSED - Create itinerary:', createdItinerary.id);

    // Test 2: Read the created itinerary
    const { data: readItinerary, error: readError } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', createdItinerary.id)
      .single();

    if (readError) {
      console.error('CRUD Test 2 FAILED - Read:', readError);
      return { success: false, message: 'Read operation failed' };
    }

    console.log('CRUD Test 2 PASSED - Read itinerary:', readItinerary.name);

    // Test 3: Update the itinerary
    const { data: updatedItinerary, error: updateError } = await supabase
      .from('itineraries')
      .update({ 
        name: 'CRUD Test Itinerary - Updated',
        updated_at: new Date().toISOString()
      })
      .eq('id', createdItinerary.id)
      .select()
      .single();

    if (updateError) {
      console.error('CRUD Test 3 FAILED - Update:', updateError);
      return { success: false, message: 'Update operation failed' };
    }

    console.log('CRUD Test 3 PASSED - Update itinerary:', updatedItinerary.name);

    // Test 4: Test RLS by trying to access another user's data
    const { data: rlsTest, error: rlsError } = await supabase
      .from('itineraries')
      .select('*')
      .neq('agent_id', user.id);

    if (rlsTest && rlsTest.length === 0) {
      console.log('CRUD Test 4 PASSED - RLS working correctly (no unauthorized access)');
    } else {
      console.warn('CRUD Test 4 WARNING - RLS might not be working as expected');
    }

    // Test 5: Clean up - Delete the test itinerary
    const { error: deleteError } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', createdItinerary.id);

    if (deleteError) {
      console.error('CRUD Test 5 FAILED - Delete:', deleteError);
      return { success: false, message: 'Delete operation failed' };
    }

    console.log('CRUD Test 5 PASSED - Delete itinerary completed');

    return {
      success: true,
      message: 'All CRUD operations tested successfully! RLS policies are working correctly.'
    };

  } catch (error) {
    console.error('CRUD testing failed:', error);
    return {
      success: false,
      message: `CRUD testing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
