import { supabase } from '@/integrations/supabase/client';
import { negotiationService } from './negotiationService';

export async function seedNegotiationTestData() {
  try {
    console.log('Seeding negotiation test data...');

    // 1. Create a test itinerary with approval_status = 'approved'
    const testItinerary = {
      agent_id: '00000000-0000-0000-0000-000000000001', // Demo agent ID
      name: 'Phuket Paradise Adventure',
      destination: 'Phuket, Thailand',
      start_date: '2024-04-15',
      end_date: '2024-04-21',
      number_of_travelers: 4,
      preferences: 'Beach relaxation, cultural tours, family-friendly activities',
      status: 'shared',
      approval_status: 'approved',
      days: [
        {
          day: 1,
          title: 'Arrival Day',
          activities: [
            'Airport transfer to resort',
            'Resort check-in and welcome drink',
            'Dinner at beachfront restaurant',
            'Evening beach walk'
          ]
        },
        {
          day: 2,
          title: 'Cultural Exploration',
          activities: [
            'Big Buddha temple tour',
            'Local market visit and cooking class',
            'Traditional Thai massage',
            'Sunset dinner cruise'
          ]
        },
        {
          day: 3,
          title: 'Island Adventure',
          activities: [
            'Phi Phi Islands boat excursion',
            'Snorkeling and swimming',
            'Beach BBQ lunch',
            'Hotel relaxation and spa time'
          ]
        },
        {
          day: 4,
          title: 'Adventure Activities',
          activities: [
            'Zipline adventure park',
            'ATV jungle tour',
            'Lunch at mountain restaurant',
            'Evening street food tour'
          ]
        },
        {
          day: 5,
          title: 'Beach and Culture',
          activities: [
            'Kata Beach morning',
            'Phuket Old Town walking tour',
            'Art galleries and museums',
            'Farewell dinner show'
          ]
        },
        {
          day: 6,
          title: 'Departure',
          activities: [
            'Final spa treatment',
            'Resort checkout',
            'Airport transfer',
            'Departure'
          ]
        }
      ]
    };

    const { data: createdItinerary, error: itineraryError } = await supabase
      .from('itineraries')
      .insert(testItinerary)
      .select()
      .single();

    if (itineraryError) {
      console.error('Error creating test itinerary:', itineraryError);
      return { success: false, error: itineraryError.message };
    }

    console.log('✅ Test itinerary created:', createdItinerary.id);

    // 2. Trigger the auto-parsing for this itinerary
    const { itineraryParsingService } = await import('./itineraryParsingService');
    const parseResult = await itineraryParsingService.autoParseApprovedItinerary(createdItinerary.id);

    if (parseResult.success) {
      console.log(`✅ Successfully parsed itinerary into ${parseResult.itemsCreated} negotiable items`);
      console.log(`💰 Total estimated value: $${parseResult.estimatedValue}`);
    } else {
      console.error('❌ Failed to parse itinerary');
    }

    // 3. Seed some market intelligence data
    const marketData = [
      {
        service_type: 'transportation',
        location: 'Phuket, Thailand',
        service_name: 'Airport Transfer',
        season: 'high',
        market_rate_min: 800,
        market_rate_avg: 1200,
        market_rate_max: 1800,
        typical_discount_pct: 10,
        max_achievable_discount_pct: 25,
        negotiation_success_rate: 85,
        average_negotiation_rounds: 2,
        optimal_timing_hours: [9, 10, 11, 14, 15, 16],
        seasonal_factors: { high_season_multiplier: 1.3, low_season_multiplier: 0.8 },
        group_size_factors: { "2": 1.0, "4": 1.5, "6": 2.0 },
        sample_size: 150,
        confidence_score: 0.92,
        valid_from: '2024-01-01',
        valid_until: '2024-12-31'
      },
      {
        service_type: 'tours',
        location: 'Phuket, Thailand',
        service_name: 'Phi Phi Islands Tour',
        season: 'high',
        market_rate_min: 2000,
        market_rate_avg: 2800,
        market_rate_max: 3500,
        typical_discount_pct: 15,
        max_achievable_discount_pct: 30,
        negotiation_success_rate: 78,
        average_negotiation_rounds: 3,
        optimal_timing_hours: [8, 9, 10],
        seasonal_factors: { high_season_multiplier: 1.4, low_season_multiplier: 0.7 },
        group_size_factors: { "2": 1.0, "4": 1.8, "6": 2.5 },
        sample_size: 230,
        confidence_score: 0.88,
        valid_from: '2024-01-01',
        valid_until: '2024-12-31'
      },
      {
        service_type: 'accommodation',
        location: 'Phuket, Thailand',
        service_name: 'Beachfront Resort',
        season: 'high',
        market_rate_min: 8000,
        market_rate_avg: 12000,
        market_rate_max: 18000,
        typical_discount_pct: 12,
        max_achievable_discount_pct: 25,
        negotiation_success_rate: 65,
        average_negotiation_rounds: 4,
        optimal_timing_hours: [10, 11, 12, 13, 14],
        seasonal_factors: { high_season_multiplier: 1.5, low_season_multiplier: 0.6 },
        group_size_factors: { "2": 1.0, "4": 1.2, "6": 1.4 },
        sample_size: 180,
        confidence_score: 0.85,
        valid_from: '2024-01-01',
        valid_until: '2024-12-31'
      }
    ];

    const { error: marketError } = await supabase
      .from('market_intelligence')
      .insert(marketData);

    if (marketError) {
      console.log('Market intelligence data may already exist:', marketError.message);
    } else {
      console.log('✅ Market intelligence data seeded');
    }

    // 4. Create some vendor profiles
    const vendorProfiles = [
      {
        user_id: '00000000-0000-0000-0000-000000000010',
        company_name: 'Phuket Premium Transport',
        contact_person: 'Somchai Tanaka',
        phone: '+66-76-123456',
        service_specializations: ['transportation', 'transfers'],
        coverage_areas: ['Phuket', 'Krabi', 'Surat Thani'],
        response_time_avg_hours: 6,
        success_rate: 92,
        preferred_partner: true,
        business_license: 'TH-TRANS-2024-001',
        contract_terms: { payment_terms: '30 days', cancellation_policy: '48 hours' }
      },
      {
        user_id: '00000000-0000-0000-0000-000000000011',
        company_name: 'Island Adventure Tours',
        contact_person: 'Maya Nakamura',
        phone: '+66-76-654321',
        service_specializations: ['tours', 'excursions', 'activities'],
        coverage_areas: ['Phuket', 'Phi Phi', 'James Bond Island'],
        response_time_avg_hours: 4,
        success_rate: 88,
        preferred_partner: true,
        business_license: 'TH-TOUR-2024-002',
        contract_terms: { payment_terms: '15 days', cancellation_policy: '24 hours' }
      }
    ];

    const { error: vendorError } = await supabase
      .from('vendor_profiles')
      .insert(vendorProfiles);

    if (vendorError) {
      console.log('Vendor profiles may already exist:', vendorError.message);
    } else {
      console.log('✅ Vendor profiles seeded');
    }

    return {
      success: true,
      itineraryId: createdItinerary.id,
      parseResult
    };

  } catch (error) {
    console.error('Error seeding negotiation test data:', error);
    return { success: false, error: error.message };
  }
}

export async function createSampleNegotiations(itineraryId: string, agentId: string = '00000000-0000-0000-0000-000000000001') {
  try {
    console.log('Creating sample negotiations...');

    // Create some sample negotiations based on the parsed items
    const { data: items } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('itinerary_id', itineraryId)
      .limit(3); // Just a few for demonstration

    if (!items || items.length === 0) {
      console.log('No itinerary items found to create negotiations');
      return { success: false, error: 'No items found' };
    }

    const negotiations = [];
    const vendorIds = [
      '00000000-0000-0000-0000-000000000010',
      '00000000-0000-0000-0000-000000000011'
    ];

    for (let i = 0; i < Math.min(items.length, 3); i++) {
      const item = items[i];
      const vendorId = vendorIds[i % vendorIds.length];
      
      const negotiation = await negotiationService.createNegotiation({
        itinerary_id: itineraryId,
        itinerary_item_id: item.id,
        agent_id: agentId,
        vendor_id: vendorId,
        service_type: item.item_type,
        description: item.service_name,
        status: i === 0 ? 'negotiating' : 'pending',
        original_price: item.estimated_price,
        target_price: Math.round((item.estimated_price || 0) * 0.8), // 20% discount target
        negotiation_priority: (item.negotiation_priority as 'low' | 'medium' | 'high') || 'medium'
      });

      negotiations.push(negotiation);
      
      // Add a sample message for the first negotiation
      if (i === 0) {
        await negotiationService.addMessage(negotiation.id, {
          sender_id: agentId,
          sender_role: 'agent',
          message: `Hello! We're interested in ${item.service_name}. Can you provide a competitive rate for ${item.participants} people?`,
          price_offer: Math.round((item.estimated_price || 0) * 0.85) // 15% discount offer
        });
      }
    }

    console.log(`✅ Created ${negotiations.length} sample negotiations`);
    return { 
      success: true, 
      negotiationsCreated: negotiations.length,
      negotiations: negotiations
    };

  } catch (error) {
    console.error('Error creating sample negotiations:', error);
    return { success: false, error: error.message };
  }
}

export async function testApprovalWorkflow() {
  console.log('🧪 Testing approval workflow...');
  
  const result = await seedNegotiationTestData();
  
  if (result.success) {
    console.log('✅ Test data seeded successfully!');
    console.log(`📋 Test itinerary ID: ${result.itineraryId}`);
    console.log(`🔧 Parsed items: ${result.parseResult?.itemsCreated || 0}`);
    console.log(`💰 Estimated value: $${result.parseResult?.estimatedValue || 0}`);
    
    // Create sample negotiations
    const negotiationResult = await createSampleNegotiations(result.itineraryId);
    if (negotiationResult.success) {
      console.log(`🤝 Created ${negotiationResult.negotiationsCreated} sample negotiations`);
    }
    
    console.log('');
    console.log('📍 Next steps:');
    console.log('1. Check the Agent Dashboard for the approved itinerary');
    console.log('2. Click "Start Negotiations" to see parsed items');
    console.log('3. Navigate to Rate Negotiation AI to see active negotiations');
    console.log('4. Navigate through the negotiation workflow');
  } else {
    console.error('❌ Test failed:', result.error);
  }
  
  return result;
}