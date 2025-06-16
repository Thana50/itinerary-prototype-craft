
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export const useClientPortalActions = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleApproveItinerary = () => {
    toast({
      title: "Itinerary Approved!",
      description: "Your customized trip has been sent to your travel agent for final booking.",
    });
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
