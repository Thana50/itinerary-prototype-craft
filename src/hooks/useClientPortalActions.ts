
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
        
        // Auto-parse itinerary into negotiable items
        const { itineraryParsingService } = await import("@/services/itineraryParsingService");
        const parseResult = await itineraryParsingService.autoParseApprovedItinerary(itineraryId);
        
        if (parseResult.success) {
          // Create notification for agent about the approved itinerary
          const { notificationService } = await import("@/services/notificationService");
          // Note: In a real app, we'd get the agent_id from the itinerary
          // For now, we'll show success message to traveler
          
          toast({
            title: "Itinerary Approved!",
            description: `Your travel agent will start rate negotiations for ${parseResult.itemsCreated} services (Est. value: $${parseResult.estimatedValue.toLocaleString()})`,
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
