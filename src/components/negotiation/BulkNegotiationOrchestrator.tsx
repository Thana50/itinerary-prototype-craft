import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  TrendingUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { negotiationService } from '@/services/negotiationService';
import { notificationService } from '@/services/notificationService';
import { negotiationHistoryService } from '@/services/negotiationHistoryService';
import type { ItineraryItem } from '@/services/itineraryItemService';
import type { VendorMatch } from '@/services/vendorMatchingService';

interface SelectedNegotiationItem extends Omit<ItineraryItem, 'suggested_vendors'> {
  pricing_recommendation?: any;
  suggested_vendors?: VendorMatch[];
  target_price?: number;
  priority_override?: 'low' | 'medium' | 'high';
}

interface BulkNegotiationOrchestratorProps {
  selectedItems: SelectedNegotiationItem[];
  agentId: string;
  onComplete: (negotiationIds: string[]) => void;
  onCancel: () => void;
}

interface NegotiationProgress {
  itemId: string;
  negotiationId?: string;
  status: 'pending' | 'creating' | 'sent' | 'responded' | 'completed' | 'failed';
  assignedVendor?: VendorMatch;
  error?: string;
  responseReceived?: boolean;
}

const BulkNegotiationOrchestrator = ({
  selectedItems,
  agentId,
  onComplete,
  onCancel
}: BulkNegotiationOrchestratorProps) => {
  const [progress, setProgress] = useState<NegotiationProgress[]>([]);
  const [currentStep, setCurrentStep] = useState<'vendor-assignment' | 'creating-negotiations' | 'monitoring' | 'completed'>('vendor-assignment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedNegotiations, setCompletedNegotiations] = useState<string[]>([]);

  useEffect(() => {
    // Initialize progress tracking
    const initialProgress: NegotiationProgress[] = selectedItems.map(item => ({
      itemId: item.id,
      status: 'pending',
      assignedVendor: item.suggested_vendors?.[0] // Default to best match
    }));
    setProgress(initialProgress);
  }, [selectedItems]);

  const startBulkNegotiation = async () => {
    setIsProcessing(true);
    setCurrentStep('vendor-assignment');

    try {
      // Step 1: Finalize vendor assignments
      await finalizeVendorAssignments();
      
      // Step 2: Create negotiations
      setCurrentStep('creating-negotiations');
      await createNegotiations();
      
      // Step 3: Monitor responses
      setCurrentStep('monitoring');
      
    } catch (error) {
      console.error('Bulk negotiation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeVendorAssignments = async () => {
    const updatedProgress = [...progress];
    
    for (let i = 0; i < updatedProgress.length; i++) {
      const item = selectedItems[i];
      const progressItem = updatedProgress[i];
      
      if (!progressItem.assignedVendor) {
        // Find best available vendor if none assigned
        const bestVendor = item.suggested_vendors?.[0];
        if (bestVendor) {
          progressItem.assignedVendor = bestVendor;
          progressItem.status = 'pending';
        } else {
          progressItem.status = 'failed';
          progressItem.error = 'No suitable vendor found';
        }
      }
    }
    
    setProgress(updatedProgress);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
  };

  const createNegotiations = async () => {
    const updatedProgress = [...progress];
    const negotiationIds: string[] = [];

    for (let i = 0; i < updatedProgress.length; i++) {
      const item = selectedItems[i];
      const progressItem = updatedProgress[i];
      
      if (progressItem.status === 'failed' || !progressItem.assignedVendor) {
        continue;
      }

      try {
        progressItem.status = 'creating';
        setProgress([...updatedProgress]);

        // Create negotiation
        const negotiation = await negotiationService.createNegotiation({
          itinerary_id: item.itinerary_id,
          agent_id: agentId,
          vendor_id: progressItem.assignedVendor.vendor.user_id,
          service_type: item.item_type,
          description: `Rate negotiation for ${item.service_name}`,
          status: 'pending',
          itinerary_item_id: item.id,
          original_price: item.estimated_price,
          target_price: item.target_price,
          negotiation_priority: item.priority_override || item.negotiation_priority,
          negotiation_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        });

        progressItem.negotiationId = negotiation.id;
        progressItem.status = 'sent';
        negotiationIds.push(negotiation.id);

        // Log initial negotiation history
        await negotiationHistoryService.addHistoryEntry(
          negotiation.id,
          'price_offer',
          agentId,
          'agent',
          {
            newValue: {
              price: item.target_price,
              service: item.service_name,
              participants: item.participants
            },
            notes: `Initial offer for ${item.service_name} - AI recommended target price`
          }
        );

        // Send notification to vendor
        await notificationService.notifyNegotiationStarted(
          progressItem.assignedVendor.vendor.user_id,
          negotiation.id,
          item.service_name
        );

        setProgress([...updatedProgress]);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay between creations

      } catch (error) {
        progressItem.status = 'failed';
        progressItem.error = error instanceof Error ? error.message : 'Failed to create negotiation';
        setProgress([...updatedProgress]);
      }
    }

    setCompletedNegotiations(negotiationIds);
    
    if (negotiationIds.length === 0) {
      setCurrentStep('completed');
    }
  };

  const getProgressPercentage = () => {
    const total = progress.length;
    const completed = progress.filter(p => ['sent', 'completed', 'failed'].includes(p.status)).length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getStatusCounts = () => {
    return {
      total: progress.length,
      sent: progress.filter(p => p.status === 'sent').length,
      failed: progress.filter(p => p.status === 'failed').length,
      completed: progress.filter(p => p.status === 'completed').length
    };
  };

  const handleViewNegotiations = () => {
    onComplete(completedNegotiations);
  };

  const stats = getStatusCounts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bulk Negotiation Setup</span>
            <Badge variant={currentStep === 'completed' ? 'default' : 'secondary'}>
              {currentStep === 'vendor-assignment' && 'Assigning Vendors'}
              {currentStep === 'creating-negotiations' && 'Creating Negotiations'}
              {currentStep === 'monitoring' && 'Monitoring Progress'}
              {currentStep === 'completed' && 'Completed'}
            </Badge>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={getProgressPercentage()} className="w-full" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{stats.total} items selected</span>
              <span>{stats.sent} negotiations created</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negotiations Sent</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>Negotiation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress.map((progressItem, index) => {
              const item = selectedItems[index];
              return (
                <div key={progressItem.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {progressItem.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {progressItem.status === 'sent' && <Clock className="h-5 w-5 text-blue-600" />}
                      {progressItem.status === 'failed' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      {progressItem.status === 'creating' && (
                        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                      {progressItem.status === 'pending' && <Clock className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    
                    <div>
                      <p className="font-medium">{item.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Day {item.day_number} • {item.item_type}
                        {progressItem.assignedVendor && (
                          <> • {progressItem.assignedVendor.vendor.company_name}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        progressItem.status === 'completed' ? 'default' :
                        progressItem.status === 'sent' ? 'secondary' :
                        progressItem.status === 'failed' ? 'destructive' :
                        'outline'
                      }>
                        {progressItem.status}
                      </Badge>
                      {item.target_price && (
                        <span className="text-sm font-medium">
                          ${item.target_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {progressItem.error && (
                      <p className="text-xs text-red-600 mt-1">{progressItem.error}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {currentStep === 'completed' ? (
                <div>
                  <p className="font-medium text-green-600">Negotiations Successfully Created!</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.sent} negotiations have been sent to vendors and you'll receive notifications as they respond.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Ready to create negotiations?</p>
                  <p className="text-sm text-muted-foreground">
                    This will send negotiation requests to {progress.filter(p => p.assignedVendor).length} vendors.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep !== 'completed' && (
                <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
                  Cancel
                </Button>
              )}
              
              {currentStep === 'completed' ? (
                <Button onClick={handleViewNegotiations} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Negotiations
                </Button>
              ) : (
                <Button 
                  onClick={startBulkNegotiation}
                  disabled={isProcessing || progress.filter(p => p.assignedVendor).length === 0}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Start Negotiations
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.failed > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {stats.failed} items failed to create negotiations. Please review the errors above and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BulkNegotiationOrchestrator;