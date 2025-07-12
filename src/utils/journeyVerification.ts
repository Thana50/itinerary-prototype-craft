/**
 * Journey Verification Utilities
 * Tests complete user flows with real database integration
 */

import { itineraryService } from "@/services/itineraryService";
import { negotiationService } from "@/services/negotiationService";
import type { Itinerary, Negotiation } from "@/lib/supabase";

export interface JourneyTestResult {
  journey: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  data?: any;
}

/**
 * Verify Agent Dashboard → Itinerary Detail flow
 */
export const verifyAgentDashboardFlow = async (agentId: string): Promise<JourneyTestResult[]> => {
  const results: JourneyTestResult[] = [];
  
  try {
    // Test 1: Load agent itineraries
    const itineraries = await itineraryService.getAgentItineraries(agentId);
    results.push({
      journey: "Agent Dashboard Data Loading",
      status: itineraries.length > 0 ? 'passed' : 'warning',
      message: `Found ${itineraries.length} itineraries for agent`,
      data: { count: itineraries.length }
    });

    // Test 2: Verify itinerary detail navigation
    if (itineraries.length > 0) {
      const firstItinerary = itineraries[0];
      const detailItinerary = await itineraryService.getItinerary(firstItinerary.id);
      
      results.push({
        journey: "Itinerary Detail Navigation",
        status: detailItinerary.id === firstItinerary.id ? 'passed' : 'failed',
        message: `Navigation to /itinerary/${firstItinerary.id} loads correct data`,
        data: { itineraryId: firstItinerary.id, name: detailItinerary.name }
      });
    }

    // Test 3: Load agent negotiations
    const negotiations = await negotiationService.getAgentNegotiations(agentId);
    results.push({
      journey: "Agent Negotiations Loading",
      status: 'passed',
      message: `Found ${negotiations.length} negotiations for agent`,
      data: { count: negotiations.length }
    });

  } catch (error) {
    results.push({
      journey: "Agent Dashboard Flow",
      status: 'failed',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return results;
};

/**
 * Verify Create → Share → View flow
 */
export const verifyCreateShareFlow = async (agentId: string): Promise<JourneyTestResult[]> => {
  const results: JourneyTestResult[] = [];
  
  try {
    // Test 1: Create a test itinerary
    const testItinerary = {
      agent_id: agentId,
      name: "Test Journey Verification",
      destination: "Test Destination",
      start_date: "2025-07-15",
      end_date: "2025-07-20",
      number_of_travelers: 2,
      preferences: "Test preferences",
      status: 'draft' as const,
      days: [
        {
          day: 1,
          title: "Test Day",
          activities: ["Test activity"],
          date: "2025-07-15",
          location: "Test Location"
        }
      ]
    };

    const createdItinerary = await itineraryService.createItinerary(testItinerary);
    results.push({
      journey: "Create Itinerary",
      status: 'passed',
      message: `Successfully created itinerary with ID: ${createdItinerary.id}`,
      data: { id: createdItinerary.id }
    });

    // Test 2: Share the itinerary
    const sharedItinerary = await itineraryService.shareItinerary(
      createdItinerary.id, 
      "test@example.com"
    );
    
    results.push({
      journey: "Share Itinerary",
      status: sharedItinerary.share_token ? 'passed' : 'failed',
      message: sharedItinerary.share_token 
        ? `Generated share token: ${sharedItinerary.share_token}`
        : "Failed to generate share token",
      data: { shareToken: sharedItinerary.share_token }
    });

    // Test 3: Load by share token
    if (sharedItinerary.share_token) {
      const tokenItinerary = await itineraryService.getItineraryByToken(sharedItinerary.share_token);
      results.push({
        journey: "Shared Itinerary Access",
        status: tokenItinerary.id === createdItinerary.id ? 'passed' : 'failed',
        message: `Share link loads correct itinerary`,
        data: { shareUrl: `/shared/${sharedItinerary.share_token}` }
      });
    }

  } catch (error) {
    results.push({
      journey: "Create → Share Flow",
      status: 'failed',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return results;
};

/**
 * Verify Vendor Dashboard → Negotiation Room flow
 */
export const verifyVendorNegotiationFlow = async (vendorId: string): Promise<JourneyTestResult[]> => {
  const results: JourneyTestResult[] = [];
  
  try {
    // Test 1: Load vendor negotiations
    const negotiations = await negotiationService.getVendorNegotiations(vendorId);
    results.push({
      journey: "Vendor Dashboard Data Loading",
      status: 'passed',
      message: `Found ${negotiations.length} negotiations for vendor`,
      data: { count: negotiations.length }
    });

    // Test 2: Verify negotiation detail navigation
    if (negotiations.length > 0) {
      const firstNegotiation = negotiations[0];
      const detailNegotiation = await negotiationService.getNegotiation(firstNegotiation.id);
      
      results.push({
        journey: "Negotiation Room Navigation",
        status: detailNegotiation.id === firstNegotiation.id ? 'passed' : 'failed',
        message: `Navigation to /negotiation-room/${firstNegotiation.id} loads correct data`,
        data: { 
          negotiationId: firstNegotiation.id, 
          serviceType: detailNegotiation.service_type,
          messageCount: Array.isArray(detailNegotiation.messages) ? detailNegotiation.messages.length : 0
        }
      });
    }

  } catch (error) {
    results.push({
      journey: "Vendor Negotiation Flow",
      status: 'failed',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return results;
};

/**
 * Run all journey verifications
 */
export const runAllJourneyTests = async (userId: string, userRole: string): Promise<JourneyTestResult[]> => {
  const allResults: JourneyTestResult[] = [];

  if (userRole === 'agent') {
    const agentResults = await verifyAgentDashboardFlow(userId);
    const shareResults = await verifyCreateShareFlow(userId);
    allResults.push(...agentResults, ...shareResults);
  }

  if (userRole === 'vendor') {
    const vendorResults = await verifyVendorNegotiationFlow(userId);
    allResults.push(...vendorResults);
  }

  return allResults;
};

/**
 * Format test results for display
 */
export const formatTestResults = (results: JourneyTestResult[]): string => {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  let output = `\n🧪 Journey Verification Results\n`;
  output += `✅ Passed: ${passed} | ❌ Failed: ${failed} | ⚠️ Warnings: ${warnings}\n\n`;

  results.forEach(result => {
    const icon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    output += `${icon} ${result.journey}: ${result.message}\n`;
    if (result.data) {
      output += `   Data: ${JSON.stringify(result.data, null, 2)}\n`;
    }
  });

  return output;
};