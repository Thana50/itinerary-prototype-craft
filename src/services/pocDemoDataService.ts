
import { supabase } from '@/integrations/supabase/client';

export const pocDemoDataService = {
  async seedDemoVendorData() {
    try {
      console.log('🔄 Starting demo vendor data seeding...');
      
      // First, let's see what users actually exist in the database
      console.log('📋 Fetching all users from database...');
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('id, email, role, name');
      
      console.log('👥 All users in database:', allUsers);
      if (allUsersError) {
        console.error('❌ Error fetching all users:', allUsersError);
        return false;
      }
      
      // Get vendor@demo.com user ID from existing users
      console.log('🔍 Looking for vendor@demo.com user...');
      const { data: vendorUser, error: vendorError } = await supabase
        .from('users')
        .select('id, email, role, name')
        .eq('email', 'vendor@demo.com')
        .maybeSingle();

      console.log('🏢 Vendor user query result:', vendorUser);
      if (vendorError) {
        console.error('❌ Vendor user query error:', vendorError);
        return false;
      }

      if (!vendorUser) {
        console.error('❌ Demo vendor user not found. Please ensure vendor@demo.com exists in the users table.');
        console.log('📋 Available users:', allUsers?.map(u => u.email).join(', '));
        return false;
      }

      const vendorId = vendorUser.id;
      console.log('✅ Found vendor user with ID:', vendorId);

      // Check if vendor profile already exists
      console.log('🔍 Checking for existing vendor profile...');
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('vendor_profiles')
        .select('user_id')
        .eq('user_id', vendorId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('❌ Error checking existing vendor profile:', profileCheckError);
        return false;
      }

      if (existingProfile) {
        console.log('ℹ️ Vendor profile already exists, skipping creation');
      } else {
        console.log('🔄 Creating comprehensive vendor profile...');
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
          console.error('❌ Error creating vendor profile:', profileError);
          return false;
        }

        console.log('✅ Vendor profile created successfully');
      }

      // Check if vendor services already exist
      console.log('🔍 Checking for existing vendor services...');
      const { data: existingServices, error: servicesCheckError } = await supabase
        .from('vendor_services')
        .select('id')
        .eq('vendor_id', vendorId);

      if (servicesCheckError) {
        console.error('❌ Error checking existing vendor services:', servicesCheckError);
        return false;
      }

      if (existingServices && existingServices.length > 0) {
        console.log('ℹ️ Vendor services already exist, skipping creation');
      } else {
        console.log('🔄 Creating comprehensive vendor services...');
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
          console.log(`🔄 Creating service: ${service.service_name}...`);
          const { error: serviceError } = await supabase
            .from('vendor_services')
            .upsert(service);

          if (serviceError) {
            console.error(`❌ Error creating vendor service ${service.service_name}:`, serviceError);
            return false;
          } else {
            console.log(`✅ Created service: ${service.service_name}`);
          }
        }
      }

      console.log('✅ Demo vendor data seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Unexpected error seeding demo vendor data:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      return false;
    }
  },

  async seedDemoItineraryData() {
    try {
      console.log('🔄 Starting demo itinerary data seeding...');
      
      // Get user IDs from existing users with detailed logging
      console.log('📋 Fetching agent and traveler users...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, role, name')
        .in('email', ['agent@demo.com', 'traveler@demo.com']);

      console.log('👥 Users query result:', users);
      if (usersError) {
        console.error('❌ Users query error:', usersError);
        return false;
      }

      if (!users || users.length < 2) {
        console.error('❌ Demo users not found. Please ensure agent@demo.com and traveler@demo.com exist in the users table.');
        
        // Let's see what users are actually available
        const { data: allUsers } = await supabase
          .from('users')
          .select('id, email, role, name');
        console.log('📋 All available users:', allUsers);
        
        return false;
      }

      const agentUser = users.find(u => u.email === 'agent@demo.com');
      const travelerUser = users.find(u => u.email === 'traveler@demo.com');

      if (!agentUser || !travelerUser) {
        console.error('❌ Required demo users not found');
        console.log('📋 Found users:', users.map(u => u.email));
        return false;
      }

      const agentId = agentUser.id;
      const travelerId = travelerUser.id;

      console.log('✅ Found agent ID:', agentId);
      console.log('✅ Found traveler ID:', travelerId);

      // Check if sample itinerary already exists
      console.log('🔍 Checking for existing sample itinerary...');
      const { data: existingItinerary, error: itineraryCheckError } = await supabase
        .from('itineraries')
        .select('id')
        .eq('agent_id', agentId)
        .eq('name', 'Dream Paris Getaway')
        .maybeSingle();

      if (itineraryCheckError) {
        console.error('❌ Error checking existing itinerary:', itineraryCheckError);
        return false;
      }

      if (existingItinerary) {
        console.log('ℹ️ Sample itinerary already exists, skipping creation');
        return true;
      }

      // Create sample itinerary
      console.log('🔄 Creating sample itinerary...');
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
        console.error('❌ Error creating sample itinerary:', itineraryError);
        return false;
      }

      console.log('✅ Demo itinerary data seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Unexpected error seeding demo itinerary data:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      return false;
    }
  },

  async initializePocData() {
    console.log('🚀 Initializing PoC demo data...');
    
    const vendorResult = await this.seedDemoVendorData();
    const itineraryResult = await this.seedDemoItineraryData();
    
    if (vendorResult && itineraryResult) {
      console.log('🎉 PoC demo data initialized successfully');
      return true;
    } else {
      console.error('⚠️ Failed to initialize some PoC demo data');
      console.log('Results:', { vendorResult, itineraryResult });
      return false;
    }
  }
};
