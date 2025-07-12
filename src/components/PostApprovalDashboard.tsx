import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  DollarSign,
  Activity,
  MessageSquare
} from 'lucide-react';
import { bulkNegotiationService } from '@/services/bulkNegotiationService';
import { postApprovalOrchestrator, type WorkflowProgress } from '@/services/postApprovalOrchestrator';
import { useAuth } from '@/contexts/AuthContext';
import type { Negotiation } from '@/lib/supabase';

interface PostApprovalDashboardProps {
  itineraryId: string;
  className?: string;
}

export function PostApprovalDashboard({ itineraryId, className }: PostApprovalDashboardProps) {
  const { user } = useAuth();
  const [workflowProgress, setWorkflowProgress] = useState<WorkflowProgress | null>(null);
  const [negotiationStatus, setNegotiationStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadDashboardData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [itineraryId, user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      // Get workflow progress
      const progress = postApprovalOrchestrator.getWorkflowProgress(itineraryId);
      setWorkflowProgress(progress);

      // Get detailed negotiation status
      const status = await bulkNegotiationService.getBulkNegotiationStatus(itineraryId, user.id);
      setNegotiationStatus(status);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  };

  const getOverallStatus = () => {
    if (!negotiationStatus) return 'initializing';
    
    const { totalNegotiations, pendingNegotiations, acceptedNegotiations } = negotiationStatus;
    
    if (totalNegotiations === 0) return 'no_negotiations';
    if (pendingNegotiations === 0) return 'completed';
    if (acceptedNegotiations > 0) return 'partial';
    return 'active';
  };

  const handleManualIntervention = async (negotiationId: string) => {
    // Navigate to specific negotiation for manual handling
    window.location.href = `/rate-negotiation-ai?focus=${negotiationId}`;
  };

  if (isLoading || !negotiationStatus) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  const overallStatus = getOverallStatus();
  const completionRate = negotiationStatus.totalNegotiations > 0 
    ? ((negotiationStatus.acceptedNegotiations + negotiationStatus.rejectedNegotiations) / negotiationStatus.totalNegotiations) * 100 
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Post-Approval Progress
            <Badge className="ml-auto" variant={overallStatus === 'completed' ? 'default' : 'secondary'}>
              {Math.round(completionRate)}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionRate} className="h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-blue-600">{negotiationStatus.totalNegotiations}</p>
              <p className="text-sm text-muted-foreground">Total Negotiations</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-yellow-600">{negotiationStatus.pendingNegotiations}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-600">{negotiationStatus.acceptedNegotiations}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-green-600">${negotiationStatus.totalSavings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({negotiationStatus.pendingNegotiations})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({negotiationStatus.acceptedNegotiations})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {negotiationStatus.negotiations
            .filter((n: Negotiation) => n.status === 'pending' || n.status === 'negotiating')
            .map((negotiation: Negotiation) => (
              <Card key={negotiation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{negotiation.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        Service: {negotiation.service_type} • 
                        Target: ${negotiation.target_price?.toLocaleString() || 'TBD'} • 
                        Original: ${negotiation.original_price?.toLocaleString() || 'TBD'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {negotiation.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManualIntervention(negotiation.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
          
          {negotiationStatus.pendingNegotiations === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All negotiations complete!</h3>
                <p className="text-muted-foreground">
                  Your itinerary is ready for final booking confirmation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {negotiationStatus.negotiations
            .filter((n: Negotiation) => n.status === 'accepted' || n.status === 'rejected')
            .map((negotiation: Negotiation) => (
              <Card key={negotiation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{negotiation.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        Final: ${negotiation.final_price?.toLocaleString() || 'N/A'} • 
                        Original: ${negotiation.original_price?.toLocaleString() || 'N/A'}
                        {negotiation.final_price && negotiation.original_price && (
                          <span className="text-green-600 ml-2">
                            (Saved: ${(negotiation.original_price - negotiation.final_price).toLocaleString()})
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge variant={negotiation.status === 'accepted' ? 'default' : 'destructive'}>
                      {negotiation.status === 'accepted' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {negotiation.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {workflowProgress && (
                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">Current: {workflowProgress.status}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(workflowProgress.lastUpdate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <p>Full timeline tracking will be available in the next update.</p>
                  <p>Check individual negotiations for detailed message history.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}