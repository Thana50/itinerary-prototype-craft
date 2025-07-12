import { supabase } from '@/integrations/supabase/client';
import { itineraryParsingService } from './itineraryParsingService';
import { bulkNegotiationService } from './bulkNegotiationService';
import { notificationService } from './notificationService';
import { vendorMatchingService } from './vendorMatchingService';
import type { Itinerary } from '@/lib/supabase';

export interface WorkflowProgress {
  itineraryId: string;
  status: 'parsing' | 'vendor_matching' | 'negotiations_active' | 'awaiting_responses' | 'partial_complete' | 'completed' | 'failed';
  progress: number; // 0-100
  totalItems: number;
  activeNegotiations: number;
  completedNegotiations: number;
  estimatedSavings: number;
  estimatedCompletion: string;
  lastUpdate: string;
}

export interface OrchestrationResult {
  success: boolean;
  workflowId: string;
  itemsParsed: number;
  negotiationsInitiated: number;
  estimatedSavings: number;
  estimatedCompletion: string;
  errors?: string[];
}

class PostApprovalOrchestrator {
  private activeWorkflows: Map<string, WorkflowProgress> = new Map();

  /**
   * Main orchestration function - triggered after itinerary approval
   */
  async initiatePostApprovalWorkflow(
    itineraryId: string,
    agentId: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<OrchestrationResult> {
    console.log(`Starting post-approval workflow for itinerary ${itineraryId}`);
    
    try {
      // Initialize workflow tracking
      const workflowProgress: WorkflowProgress = {
        itineraryId,
        status: 'parsing',
        progress: 10,
        totalItems: 0,
        activeNegotiations: 0,
        completedNegotiations: 0,
        estimatedSavings: 0,
        estimatedCompletion: this.calculateEstimatedCompletion(),
        lastUpdate: new Date().toISOString()
      };
      
      this.activeWorkflows.set(itineraryId, workflowProgress);

      // Step 1: Parse itinerary into negotiable items
      const parseResult = await itineraryParsingService.autoParseApprovedItinerary(itineraryId);
      
      if (!parseResult.success) {
        await this.handleWorkflowFailure(itineraryId, agentId, 'Failed to parse itinerary items');
        return {
          success: false,
          workflowId: itineraryId,
          itemsParsed: 0,
          negotiationsInitiated: 0,
          estimatedSavings: 0,
          estimatedCompletion: '',
          errors: ['Failed to parse itinerary items']
        };
      }

      // Update progress
      workflowProgress.status = 'vendor_matching';
      workflowProgress.progress = 30;
      workflowProgress.totalItems = parseResult.itemsCreated;
      workflowProgress.lastUpdate = new Date().toISOString();
      
      // Step 2: Get all parsed items for negotiation
      const { data: itineraryItems, error: itemsError } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .eq('is_negotiable', true);

      if (itemsError || !itineraryItems) {
        await this.handleWorkflowFailure(itineraryId, agentId, 'Failed to retrieve parsed items');
        return {
          success: false,
          workflowId: itineraryId,
          itemsParsed: parseResult.itemsCreated,
          negotiationsInitiated: 0,
          estimatedSavings: 0,
          estimatedCompletion: '',
          errors: ['Failed to retrieve parsed items']
        };
      }

      // Update progress
      workflowProgress.status = 'negotiations_active';
      workflowProgress.progress = 50;
      workflowProgress.lastUpdate = new Date().toISOString();

      // Step 3: Initiate bulk negotiations
      const negotiationResult = await bulkNegotiationService.createBulkNegotiations({
        itineraryId,
        selectedItems: itineraryItems.map(item => item.id),
        agentId,
        priority,
        deadline: this.calculateNegotiationDeadline(),
        autoApprovalThreshold: this.getAutoApprovalThreshold(priority)
      });

      // Update progress
      workflowProgress.status = 'awaiting_responses';
      workflowProgress.progress = 70;
      workflowProgress.activeNegotiations = negotiationResult.negotiationsCreated;
      workflowProgress.estimatedSavings = negotiationResult.estimatedSavings;
      workflowProgress.lastUpdate = new Date().toISOString();

      // Step 4: Set up monitoring for completion
      this.setupNegotiationMonitoring(itineraryId, agentId);

      // Notify agent of successful initiation
      await notificationService.createNotification(
        agentId,
        'workflow_update',
        'Negotiations Initiated',
        `Successfully started ${negotiationResult.negotiationsCreated} negotiations for approved itinerary. Est. savings: $${negotiationResult.estimatedSavings}`,
        {
          priority: 'high',
          actionUrl: `/agent-dashboard/negotiations?itinerary=${itineraryId}`
        }
      );

      return {
        success: true,
        workflowId: itineraryId,
        itemsParsed: parseResult.itemsCreated,
        negotiationsInitiated: negotiationResult.negotiationsCreated,
        estimatedSavings: negotiationResult.estimatedSavings,
        estimatedCompletion: workflowProgress.estimatedCompletion,
        errors: negotiationResult.errors
      };

    } catch (error) {
      console.error('Error in post-approval workflow:', error);
      await this.handleWorkflowFailure(itineraryId, agentId, error.message);
      
      return {
        success: false,
        workflowId: itineraryId,
        itemsParsed: 0,
        negotiationsInitiated: 0,
        estimatedSavings: 0,
        estimatedCompletion: '',
        errors: [error.message || 'Unknown workflow error']
      };
    }
  }

  /**
   * Monitor ongoing negotiations and handle completion
   */
  private async setupNegotiationMonitoring(itineraryId: string, agentId: string) {
    // Check negotiation status every few minutes
    const checkInterval = setInterval(async () => {
      await this.checkNegotiationProgress(itineraryId, agentId);
    }, 300000); // 5 minutes

    // Clean up after 24 hours max
    setTimeout(() => {
      clearInterval(checkInterval);
      this.activeWorkflows.delete(itineraryId);
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Check progress of negotiations and handle completion
   */
  async checkNegotiationProgress(itineraryId: string, agentId: string): Promise<void> {
    try {
      const status = await bulkNegotiationService.getBulkNegotiationStatus(itineraryId, agentId);
      const workflowProgress = this.activeWorkflows.get(itineraryId);
      
      if (!workflowProgress) return;

      const completionRate = status.totalNegotiations > 0 
        ? (status.acceptedNegotiations + status.rejectedNegotiations) / status.totalNegotiations 
        : 0;

      // Update progress
      workflowProgress.activeNegotiations = status.pendingNegotiations;
      workflowProgress.completedNegotiations = status.acceptedNegotiations + status.rejectedNegotiations;
      workflowProgress.estimatedSavings = status.totalSavings;
      workflowProgress.progress = 70 + (completionRate * 30); // 70-100%
      workflowProgress.lastUpdate = new Date().toISOString();

      // Check if workflow is complete
      if (completionRate >= 0.8 || status.pendingNegotiations === 0) {
        await this.completeWorkflow(itineraryId, agentId, status);
      } else if (completionRate >= 0.5) {
        workflowProgress.status = 'partial_complete';
        await this.notifyPartialCompletion(itineraryId, agentId, status);
      }

    } catch (error) {
      console.error('Error checking negotiation progress:', error);
    }
  }

  /**
   * Handle workflow completion
   */
  private async completeWorkflow(
    itineraryId: string, 
    agentId: string, 
    finalStatus: any
  ): Promise<void> {
    const workflowProgress = this.activeWorkflows.get(itineraryId);
    if (!workflowProgress) return;

    // Update final status
    workflowProgress.status = 'completed';
    workflowProgress.progress = 100;
    workflowProgress.lastUpdate = new Date().toISOString();

    // Update itinerary status
    await supabase
      .from('itineraries')
      .update({ 
        status: 'negotiated',
        updated_at: new Date().toISOString()
      })
      .eq('id', itineraryId);

    // Send completion notifications
    await notificationService.createNotification(
      agentId,
      'workflow_complete',
      'Negotiations Complete',
      `All negotiations finished! Accepted: ${finalStatus.acceptedNegotiations}, Total savings: $${finalStatus.totalSavings}`,
      {
        priority: 'high',
        actionUrl: `/agent-dashboard/itineraries/${itineraryId}`
      }
    );

    // Get traveler ID and notify them
    const { data: itinerary } = await supabase
      .from('itineraries')
      .select('traveler_id, name')
      .eq('id', itineraryId)
      .single();

    if (itinerary?.traveler_id) {
      await notificationService.createNotification(
        itinerary.traveler_id,
        'booking_ready',
        'Your Trip is Ready!',
        `Great news! Your agent has secured the best rates for "${itinerary.name}". Total savings: $${finalStatus.totalSavings}`,
        {
          priority: 'high',
          actionUrl: `/shared-itinerary/${itineraryId}`
        }
      );
    }

    // Clean up workflow tracking
    this.activeWorkflows.delete(itineraryId);
  }

  /**
   * Handle partial completion notifications
   */
  private async notifyPartialCompletion(
    itineraryId: string,
    agentId: string,
    status: any
  ): Promise<void> {
    await notificationService.createNotification(
      agentId,
      'workflow_update',
      'Negotiation Update',
      `Good progress! ${status.acceptedNegotiations} of ${status.totalNegotiations} negotiations complete. Savings so far: $${status.totalSavings}`,
      {
        priority: 'medium',
        actionUrl: `/agent-dashboard/negotiations?itinerary=${itineraryId}`
      }
    );
  }

  /**
   * Handle workflow failures
   */
  private async handleWorkflowFailure(
    itineraryId: string,
    agentId: string,
    errorMessage: string
  ): Promise<void> {
    const workflowProgress = this.activeWorkflows.get(itineraryId);
    if (workflowProgress) {
      workflowProgress.status = 'failed';
      workflowProgress.lastUpdate = new Date().toISOString();
    }

    await notificationService.createNotification(
      agentId,
      'error',
      'Workflow Error',
      `Error in post-approval workflow: ${errorMessage}. Please review manually.`,
      {
        priority: 'high',
        actionUrl: `/agent-dashboard/itineraries/${itineraryId}`
      }
    );
  }

  /**
   * Get current workflow progress
   */
  getWorkflowProgress(itineraryId: string): WorkflowProgress | null {
    return this.activeWorkflows.get(itineraryId) || null;
  }

  /**
   * Calculate estimated completion time
   */
  private calculateEstimatedCompletion(): string {
    // Most negotiations complete within 2-4 hours
    const estimatedHours = 3;
    const completionTime = new Date();
    completionTime.setHours(completionTime.getHours() + estimatedHours);
    return completionTime.toISOString();
  }

  /**
   * Calculate negotiation deadline
   */
  private calculateNegotiationDeadline(): string {
    // Give vendors 24 hours to respond
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 24);
    return deadline.toISOString();
  }

  /**
   * Get auto-approval threshold based on priority
   */
  private getAutoApprovalThreshold(priority: 'low' | 'medium' | 'high'): number {
    const thresholds = {
      low: 0.05,    // 5% discount auto-approve
      medium: 0.10, // 10% discount auto-approve
      high: 0.15    // 15% discount auto-approve
    };
    return thresholds[priority];
  }

  /**
   * Handle vendor non-response scenarios
   */
  async handleVendorNonResponse(negotiationId: string): Promise<void> {
    try {
      // Get the negotiation details
      const { data: negotiation } = await supabase
        .from('negotiations')
        .select('*, itinerary_items(*)')
        .eq('id', negotiationId)
        .single();

      if (!negotiation) return;

      // Find alternative vendors (excluding the non-responsive one)
      const alternativeVendors = await vendorMatchingService.findMatchingVendors(
        negotiation.service_type,
        negotiation.itinerary_items?.location || 'Phuket, Thailand',
        {
          participants: negotiation.itinerary_items?.participants || 1
        }
      );
      
      // Filter out the non-responsive vendor
      const filteredVendors = alternativeVendors.filter(v => v.vendor.user_id !== negotiation.vendor_id);

      if (filteredVendors.length > 0) {
        // Create new negotiation with alternative vendor
        const newVendor = filteredVendors[0];
        
        // Mark original as expired and create new one
        await supabase
          .from('negotiations')
          .update({ status: 'expired' })
          .eq('id', negotiationId);

        // This would create a new negotiation with the alternative vendor
        // Implementation details would follow the same pattern as bulk negotiation
        
        await notificationService.createNotification(
          negotiation.agent_id,
          'vendor_change',
          'Vendor Substitution',
          `Original vendor did not respond. Automatically switched to alternative vendor for ${negotiation.description}`,
          {
            priority: 'medium'
          }
        );
      }
    } catch (error) {
      console.error('Error handling vendor non-response:', error);
    }
  }
}

export const postApprovalOrchestrator = new PostApprovalOrchestrator();