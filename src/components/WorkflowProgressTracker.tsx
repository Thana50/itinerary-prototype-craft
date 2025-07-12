import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { postApprovalOrchestrator, type WorkflowProgress } from '@/services/postApprovalOrchestrator';

interface WorkflowProgressTrackerProps {
  itineraryId: string;
  className?: string;
}

export function WorkflowProgressTracker({ itineraryId, className }: WorkflowProgressTrackerProps) {
  const [progress, setProgress] = useState<WorkflowProgress | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if there's an active workflow for this itinerary
    const workflowProgress = postApprovalOrchestrator.getWorkflowProgress(itineraryId);
    
    if (workflowProgress) {
      setProgress(workflowProgress);
      setIsVisible(true);

      // Set up polling for progress updates
      const interval = setInterval(() => {
        const updatedProgress = postApprovalOrchestrator.getWorkflowProgress(itineraryId);
        if (updatedProgress) {
          setProgress(updatedProgress);
          
          // Hide tracker when completed
          if (updatedProgress.status === 'completed' || updatedProgress.status === 'failed') {
            setTimeout(() => setIsVisible(false), 5000); // Hide after 5 seconds
          }
        } else {
          setIsVisible(false);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [itineraryId]);

  if (!isVisible || !progress) return null;

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partial_complete':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'parsing':
        return 'Analyzing itinerary...';
      case 'vendor_matching':
        return 'Finding vendors...';
      case 'negotiations_active':
        return 'Starting negotiations...';
      case 'awaiting_responses':
        return 'Awaiting vendor responses...';
      case 'partial_complete':
        return 'Negotiations in progress...';
      case 'completed':
        return 'All negotiations complete!';
      case 'failed':
        return 'Workflow encountered an error';
      default:
        return 'Processing...';
    }
  };

  const formatTimeRemaining = () => {
    if (progress.status === 'completed' || progress.status === 'failed') return null;
    
    const estimatedCompletion = new Date(progress.estimatedCompletion);
    const now = new Date();
    const hoursRemaining = Math.max(0, Math.ceil((estimatedCompletion.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursRemaining === 0) return 'Completing soon...';
    return `~${hoursRemaining}h remaining`;
  };

  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Post-Approval Workflow
          <Badge className={`ml-auto ${getStatusColor()}`}>
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Items</p>
            <p className="font-medium">{progress.totalItems}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Active</p>
            <p className="font-medium text-blue-600">{progress.activeNegotiations}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Completed</p>
            <p className="font-medium text-green-600">{progress.completedNegotiations}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Savings</p>
            <p className="font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              ${progress.estimatedSavings.toLocaleString()}
            </p>
          </div>
        </div>

        {formatTimeRemaining() && (
          <div className="text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeRemaining()}
            </div>
          </div>
        )}

        {progress.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              🎉 All negotiations complete! Your itinerary is ready for booking.
            </p>
          </div>
        )}

        {progress.status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠️ Workflow needs attention. Your agent has been notified.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}