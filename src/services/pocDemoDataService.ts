
import { supabase } from '@/integrations/supabase/client';

export const pocDemoDataService = {
  async createDemoUsersIfNeeded() {
    try {
      console.log('Checking and creating demo users...');
      
      const demoUsers = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001', // Fixed UUID for agent
          email: 'agent@demo.com',
          role: 'agent',
          name: 'Travel Agent Demo'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002', // Fixed UUID for traveler
          email: 'traveler@demo.com',
          role: 'traveler',
          name: 'Traveler Demo'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003', // Fixed UUID for vendor
          email: 'vendor@demo.com',
          role: 'vendor',
          name: 'Vendor Demo'
        }
      ];

      for (const userData of demoUsers) {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .maybeSingle();

        if (!existingUser) {
          console.log(`Creating demo user: ${userData.email}`);
          
          // Insert the user into the public.users table
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name
            });

          if (insertError) {
            console.error(`Error creating user ${userData.email}:`, insertError);
            return false;
          }
        } else {
          console.log(`Demo user ${userData.email} already exists`);
        }
      }
      
      console.log('Demo users check/creation completed');
      return true;
    } catch (error) {
      console.error('Error creating demo users:', error);
      return false;
    }
  },

  async seedDemoVendorData() {
    try {
      // Get vendor@demo.com user ID
      const { data: vendorUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'vendor@demo.com')
        .single();

      if (!vendorUser) {
        console.error('Demo vendor user not found');
        return false;
      }

      const vendorId = vendorUser.id;

      // Create comprehensive vendor profile
      const { error: profileError } = await supabase
        .from('vendor_profiles')
        .upsert({
          user_id: vendorId,
          company_name: 'Demo Travel Services',
          contact_person: 'Demo Vendor',
          phone: '+1-555-DEMO-VENDOR',
          service_specializations: [
            'transportation',
            'accommodation',
            'tours',
            'dining',
            'activities',
            'flights',
            'hotels',
            'guided_tours',
            'car_rental',
            'boat_tours'
          ],
          coverage_areas: [
            'global',
            'europe',
            'asia',
            'americas',
            'paris',
            'bali',
            'phuket',
            'tokyo',
            'new_york',
            'london'
          ],
          response_time_avg_hours: 2,
          success_rate: 92.5,
          preferred_partner: true,
          business_license: 'DEMO-LICENSE-2024',
          contract_terms: {
            payment_terms: '30 days',
            cancellation_policy: '48 hours notice',
            service_guarantee: '100% satisfaction guaranteed'
          }
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating vendor profile:', profileError);
        return false;
      }

      // Create comprehensive vendor services
      const services = [
        {
          vendor_id: vendorId,
          service_type: 'transportation',
          service_name: 'Airport Transfers',
          location: 'global',
          base_price: 50,
          negotiable_discount_max: 15,
          capacity: 8,
          description: 'Professional airport transfer services',
          specializations: ['luxury_vehicles', 'group_transport'],
          availability: { '24_7': true },
          market_rate_reference: 60
        },
        {
          vendor_id: vendorId,
          service_type: 'accommodation',
          service_name: 'Hotel Bookings',
          location: 'global',
          base_price: 150,
          negotiable_discount_max: 20,
          capacity: 50,
          description: 'Premium hotel booking services',
          specializations: ['luxury_hotels', 'boutique_properties'],
          availability: { 'advance_booking': true },
          market_rate_reference: 180
        },
        {
          vendor_id: vendorId,
          service_type: 'tours',
          service_name: 'Guided City Tours',
          location: 'global',
          base_price: 75,
          negotiable_discount_max: 25,
          capacity: 20,
          description: 'Expert-led city tours and experiences',
          specializations: ['cultural_tours', 'food_tours', 'historical_tours'],
          availability: { 'daily': true },
          market_rate_reference: 90
        },
        {
          vendor_id: vendorId,
          service_type: 'dining',
          service_name: 'Restaurant Reservations',
          location: 'global',
          base_price: 25,
          negotiable_discount_max: 10,
          capacity: 100,
          description: 'Premium restaurant booking and concierge',
          specializations: ['fine_dining', 'local_cuisine'],
          availability: { 'advance_reservations': true },
          market_rate_reference: 30
        },
        {
          vendor_id: vendorId,
          service_type: 'activities',
          service_name: 'Adventure Activities',
          location: 'global',
          base_price: 100,
          negotiable_discount_max: 18,
          capacity: 15,
          description: 'Exciting adventure and recreational activities',
          specializations: ['water_sports', 'hiking', 'cultural_experiences'],
          availability: { 'seasonal': true },
          market_rate_reference: 120
        }
      ];

      // Insert services
      for (const service of services) {
        const { error: serviceError } = await supabase
          .from('vendor_services')
          .upsert(service);

        if (serviceError) {
          console.error('Error creating vendor service:', serviceError);
        }
      }

      console.log('Demo vendor data seeded successfully');
      return true;
    } catch (error) {
      console.error('Error seeding demo vendor data:', error);
      return false;
    }
  },

  async seedDemoItineraryData() {
    try {
      // Get user IDs
      const { data: users } = await supabase
        .from('users')
        .select('id, email')
        .in('email', ['agent@demo.com', 'traveler@demo.com']);

      if (!users || users.length < 2) {
        console.error('Demo users not found');
        return false;
      }

      const agentId = users.find(u => u.email === 'agent@demo.com')?.id;
      const travelerId = users.find(u => u.email === 'traveler@demo.com')?.id;

      if (!agentId || !travelerId) {
        console.error('Required demo users not found');
        return false;
      }

      // Create sample itinerary
      const sampleItinerary = {
        agent_id: agentId,
        traveler_id: travelerId,
        name: 'Dream Paris Getaway',
        destination: 'Paris, France',
        start_date: '2025-08-01',
        end_date: '2025-08-07',
        number_of_travelers: 2,
        preferences: 'Romantic atmosphere, fine dining, cultural experiences, luxury accommodation',
        status: 'shared',
        approval_status: 'pending',
        days: [
          {
            day: 1,
            title: 'Arrival & Exploration',
            activities: [
              'Airport transfer to hotel',
              'Check-in at luxury boutique hotel',
              'Evening stroll along the Seine',
              'Dinner at traditional French bistro'
            ]
          },
          {
            day: 2,
            title: 'Cultural Immersion',
            activities: [
              'Guided tour of the Louvre Museum',
              'Lunch at cafe near Tuileries Garden',
              'Visit to Notre-Dame Cathedral area',
              'Sunset cruise on the Seine'
            ]
          },
          {
            day: 3,
            title: 'Romantic Paris',
            activities: [
              'Morning visit to Montmartre',
              'Artist demonstration in Place du Tertre',
              'Lunch with Eiffel Tower views',
              'Evening at the Opera Garnier'
            ]
          }
        ]
      };

      const { error: itineraryError } = await supabase
        .from('itineraries')
        .upsert(sampleItinerary);

      if (itineraryError) {
        console.error('Error creating sample itinerary:', itineraryError);
        return false;
      }

      console.log('Demo itinerary data seeded successfully');
      return true;
    } catch (error) {
      console.error('Error seeding demo itinerary data:', error);
      return false;
    }
  },

  async initializePocData() {
    console.log('Initializing PoC demo data...');
    
    // First create demo users if they don't exist
    const usersResult = await this.createDemoUsersIfNeeded();
    if (!usersResult) {
      console.error('Failed to create demo users');
      return false;
    }
    
    const vendorResult = await this.seedDemoVendorData();
    const itineraryResult = await this.seedDemoItineraryData();
    
    if (vendorResult && itineraryResult) {
      console.log('PoC demo data initialized successfully');
      return true;
    } else {
      console.error('Failed to initialize some PoC demo data');
      return false;
    }
  }
};
