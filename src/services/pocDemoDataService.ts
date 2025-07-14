
import { supabase } from '@/integrations/supabase/client';

export const pocDemoDataService = {
  async seedDemoVendorData() {
    try {
      console.log('Seeding demo vendor data...');
      
      // Get vendor@demo.com user ID from existing users
      const { data: vendorUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'vendor@demo.com')
        .maybeSingle();

      if (!vendorUser) {
        console.error('Demo vendor user not found. Please ensure vendor@demo.com exists in the users table.');
        return false;
      }

      const vendorId = vendorUser.id;
      console.log('Found vendor user with ID:', vendorId);

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

      console.log('Vendor profile created successfully');

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
        } else {
          console.log(`Created service: ${service.service_name}`);
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
      console.log('Seeding demo itinerary data...');
      
      // Get user IDs from existing users
      const { data: users } = await supabase
        .from('users')
        .select('id, email')
        .in('email', ['agent@demo.com', 'traveler@demo.com']);

      if (!users || users.length < 2) {
        console.error('Demo users not found. Please ensure agent@demo.com and traveler@demo.com exist in the users table.');
        return false;
      }

      const agentId = users.find(u => u.email === 'agent@demo.com')?.id;
      const travelerId = users.find(u => u.email === 'traveler@demo.com')?.id;

      if (!agentId || !travelerId) {
        console.error('Required demo users not found');
        return false;
      }

      console.log('Found agent ID:', agentId);
      console.log('Found traveler ID:', travelerId);

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
