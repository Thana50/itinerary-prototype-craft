
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ClientLinkGeneratorProps {
  hasItinerary: boolean;
}

const ClientLinkGenerator: React.FC<ClientLinkGeneratorProps> = ({ hasItinerary }) => {
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const sampleLink = "https://travia.app/client/abc123xyz";

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    toast({
      title: "Success",
      description: "Client preview link generated successfully!",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sampleLink);
      setLinkCopied(true);
      toast({
        title: "Success",
        description: "Link copied!",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!hasItinerary) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="text-center">
        {!linkGenerated ? (
          <Button 
            onClick={handleGenerateLink}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Generate Client Preview Link
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <Check className="mr-2 h-5 w-5" />
              <span className="font-semibold">Client preview link generated successfully!</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-700 break-all">{sampleLink}</span>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="ml-3 flex-shrink-0"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 max-w-2xl mx-auto">
              <p>
                Share this link with your client so they can review and request modifications to their itinerary. 
                The link includes the full trip details and allows them to chat with our Client AI Assistant for customizations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLinkGenerator;
