
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { notificationService } from "@/services/notificationService";

export const useClientPortalActions = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleApproveItinerary = async (itineraryId?: string) => {
    if (itineraryId) {
      try {
        // Update itinerary approval status in database
        const { itineraryService } = await import("@/services/itineraryService");
        await itineraryService.updateItinerary(itineraryId, {
          approval_status: 'approved'
        });
        
        // Get itinerary details first for notifications
        const itinerary = await itineraryService.getItinerary(itineraryId);
        
        // Send initial approval notification
        await notificationService.notifyItineraryApproved(
          itinerary.agent_id,
          itineraryId,
          itinerary.name
        );
        
        // Trigger post-approval workflow orchestration
        const { postApprovalOrchestrator } = await import("@/services/postApprovalOrchestrator");
        const workflowResult = await postApprovalOrchestrator.initiatePostApprovalWorkflow(
          itineraryId,
          itinerary.agent_id,
          'medium' // Default priority
        );
        
        if (workflowResult.success) {
          toast({
            title: "Itinerary Approved!",
            description: `Starting ${workflowResult.negotiationsInitiated} negotiations for ${workflowResult.itemsParsed} services. Est. savings: $${workflowResult.estimatedSavings.toLocaleString()}`,
          });
        } else {
          toast({
            title: "Itinerary Approved!",
            description: "Your travel agent will start rate negotiations to secure the best deals.",
          });
        }
      } catch (error) {
        console.error('Error approving itinerary:', error);
        toast({
          title: "Error",
          description: "Failed to approve itinerary. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Itinerary Approved!",
        description: "Your customized trip has been sent to your travel agent for final booking.",
      });
    }
  };

  const handleRequestCall = () => {
    if (isMobile) {
      window.location.href = "tel:+15551234567"; // Example phone number
      toast({
        title: "Calling Agent",
        description: "Opening your phone app...",
      });
    } else {
      toast({
        title: "Call Requested",
        description: "Your travel agent will contact you within 2 hours to discuss your itinerary.",
      });
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your modifications have been saved. You can continue customizing anytime.",
    });
  };

  const handleShareItinerary = () => {
    const shareText = "Check out my awesome Phuket itinerary from Travia!";
    const shareUrl = window.location.href;

    if (isMobile && navigator.share) {
      navigator.share({
        title: 'My Travia Itinerary',
        text: shareText,
        url: shareUrl,
      }).then(() => {
        toast({ title: "Itinerary Shared!" });
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Share this view-only link with your travel companions.",
      });
    }
  };

  const handlePrintItinerary = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "Your itinerary is ready to print.",
    });
  };

  return {
    handleApproveItinerary,
    handleRequestCall,
    handleSaveChanges,
    handleShareItinerary,
    handlePrintItinerary
  };
};
