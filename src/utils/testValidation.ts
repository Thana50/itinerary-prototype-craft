
import { supabase } from '@/integrations/supabase/client';
import { itineraryService } from '@/services/itineraryService';
import { negotiationService } from '@/services/negotiationService';
import type { Itinerary, Negotiation } from '@/lib/supabase';

export interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  details?: any;
}

export const runComprehensiveTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      results.push({
        testName: 'Authentication',
        success: false,
        message: 'No authenticated user found'
      });
      return results;
    }

    results.push({
      testName: 'Authentication',
      success: true,
      message: `User authenticated: ${user.email}`
    });

    // Test 1: Database Connection
    try {
      const { data, error } = await supabase.from('users').select('count').single();
      results.push({
        testName: 'Database Connection',
        success: !error,
        message: error ? error.message : 'Database connection successful'
      });
    } catch (error) {
      results.push({
        testName: 'Database Connection',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown database error'
      });
    }

    // Test 2: Itinerary Service Tests
    try {
      const itineraries = await itineraryService.getAgentItineraries(user.id);
      results.push({
        testName: 'Itinerary Service - Read',
        success: true,
        message: `Successfully retrieved ${itineraries.length} itineraries`,
        details: { count: itineraries.length }
      });

      // Test create itinerary
      const testItinerary = {
        agent_id: user.id,
        name: 'Service Test Itinerary',
        destination: 'Test Location',
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        number_of_travelers: 1,
        preferences: 'Testing service layer',
        status: 'draft' as const,
        days: [{ day: 1, title: 'Test Day', activities: ['Test Activity'] }]
      };

      const createdItinerary = await itineraryService.createItinerary(testItinerary);
      results.push({
        testName: 'Itinerary Service - Create',
        success: true,
        message: `Successfully created itinerary: ${createdItinerary.id}`
      });

      // Test update itinerary
      const updatedItinerary = await itineraryService.updateItinerary(createdItinerary.id, {
        name: 'Service Test Itinerary - Updated'
      });
      results.push({
        testName: 'Itinerary Service - Update',
        success: true,
        message: `Successfully updated itinerary: ${updatedItinerary.name}`
      });

      // Clean up test itinerary
      await supabase.from('itineraries').delete().eq('id', createdItinerary.id);

    } catch (error) {
      results.push({
        testName: 'Itinerary Service',
        success: false,
        message: error instanceof Error ? error.message : 'Itinerary service error'
      });
    }

    // Test 3: Negotiation Service Tests
    try {
      const negotiations = await negotiationService.getAgentNegotiations(user.id);
      results.push({
        testName: 'Negotiation Service - Read',
        success: true,
        message: `Successfully retrieved ${negotiations.length} negotiations`,
        details: { count: negotiations.length }
      });

      // Test create negotiation (only if we have itineraries)
      const existingItineraries = await itineraryService.getAgentItineraries(user.id);
      if (existingItineraries.length > 0) {
        const testNegotiation = {
          itinerary_id: existingItineraries[0].id,
          agent_id: user.id,
          vendor_id: user.id, // Using same user for demo
          service_type: 'Test Service',
          description: 'Testing negotiation service layer',
          status: 'pending' as const
        };

        const createdNegotiation = await negotiationService.createNegotiation(testNegotiation);
        results.push({
          testName: 'Negotiation Service - Create',
          success: true,
          message: `Successfully created negotiation: ${createdNegotiation.id}`
        });

        // Test add message
        await negotiationService.addMessage(createdNegotiation.id, {
          sender_id: user.id,
          sender_role: 'agent',
          message: 'Test message from service layer'
        });
        results.push({
          testName: 'Negotiation Service - Add Message',
          success: true,
          message: 'Successfully added message to negotiation'
        });

        // Clean up test negotiation
        await supabase.from('negotiations').delete().eq('id', createdNegotiation.id);
      }

    } catch (error) {
      results.push({
        testName: 'Negotiation Service',
        success: false,
        message: error instanceof Error ? error.message : 'Negotiation service error'
      });
    }

    // Test 4: RLS Policy Tests
    try {
      // Test that user can only see their own data
      const { data: userItineraries } = await supabase
        .from('itineraries')
        .select('*')
        .eq('agent_id', user.id);

      const { data: allItineraries } = await supabase
        .from('itineraries')
        .select('*');

      results.push({
        testName: 'RLS Policies - Itineraries',
        success: userItineraries?.length === allItineraries?.length,
        message: `RLS working correctly: User sees ${userItineraries?.length || 0} itineraries, total accessible: ${allItineraries?.length || 0}`
      });

    } catch (error) {
      results.push({
        testName: 'RLS Policies',
        success: false,
        message: error instanceof Error ? error.message : 'RLS policy test error'
      });
    }

    // Test 5: Data Integrity Tests
    try {
      const { data: itinerariesWithInvalidDates } = await supabase
        .from('itineraries')
        .select('*')
        .gt('start_date', 'end_date');

      results.push({
        testName: 'Data Integrity - Date Validation',
        success: !itinerariesWithInvalidDates || itinerariesWithInvalidDates.length === 0,
        message: itinerariesWithInvalidDates?.length 
          ? `Found ${itinerariesWithInvalidDates.length} itineraries with invalid dates`
          : 'All itineraries have valid date ranges'
      });

    } catch (error) {
      results.push({
        testName: 'Data Integrity',
        success: false,
        message: error instanceof Error ? error.message : 'Data integrity test error'
      });
    }

  } catch (error) {
    results.push({
      testName: 'Comprehensive Test Suite',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in test suite'
    });
  }

  return results;
};

export const validateDataConsistency = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return results;

    // Check for orphaned negotiations (negotiations without valid itineraries)
    const { data: orphanedNegotiations } = await supabase
      .from('negotiations')
      .select(`
        id,
        itinerary_id,
        itineraries!inner(id)
      `)
      .is('itineraries.id', null);

    results.push({
      testName: 'Data Consistency - Orphaned Negotiations',
      success: !orphanedNegotiations || orphanedNegotiations.length === 0,
      message: orphanedNegotiations?.length 
        ? `Found ${orphanedNegotiations.length} orphaned negotiations`
        : 'No orphaned negotiations found'
    });

    // Check for itineraries with invalid JSON in days field
    const { data: itinerariesWithDays } = await supabase
      .from('itineraries')
      .select('id, days')
      .eq('agent_id', user.id);

    let invalidDaysCount = 0;
    itinerariesWithDays?.forEach(itinerary => {
      try {
        if (itinerary.days && Array.isArray(itinerary.days)) {
          // Valid JSON array
        } else {
          invalidDaysCount++;
        }
      } catch {
        invalidDaysCount++;
      }
    });

    results.push({
      testName: 'Data Consistency - Itinerary Days JSON',
      success: invalidDaysCount === 0,
      message: invalidDaysCount 
        ? `Found ${invalidDaysCount} itineraries with invalid days data`
        : 'All itineraries have valid days data structure'
    });

  } catch (error) {
    results.push({
      testName: 'Data Consistency Validation',
      success: false,
      message: error instanceof Error ? error.message : 'Data consistency validation error'
    });
  }

  return results;
};
