
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ClientLinkGeneratorProps {
  hasItinerary: boolean;
}

const ClientLinkGenerator: React.FC<ClientLinkGeneratorProps> = ({ hasItinerary }) => {
  const navigate = useNavigate();
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const sampleLink = "https://travia.app/client/abc123xyz";

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    toast({
      title: "Client Preview Link Generated!",
      description: "Your client can now review and customize their itinerary.",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sampleLink);
      setLinkCopied(true);
      toast({
        title: "Link Copied!",
        description: "You can now share this with your client.",
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

  const handleViewClientPortal = () => {
    navigate("/client-portal");
  };

  const handleBackToDashboard = () => {
    navigate("/agent-dashboard");
  };

  if (!hasItinerary) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Client Collaboration</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToDashboard}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center">
        {!linkGenerated ? (
          <div className="space-y-4">
            <Button 
              onClick={handleGenerateLink}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Generate Client Preview Link
            </Button>
            <p className="text-sm text-gray-600">
              Create a shareable link so your client can review and customize their itinerary.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <Check className="mr-2 h-5 w-5" />
              <span className="font-semibold">Client preview link generated successfully!</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-700 break-all flex-1 mr-3">{sampleLink}</span>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleViewClientPortal}
                variant="outline"
                className="flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Client View
              </Button>
              
              <Button 
                onClick={() => toast({ title: "Coming Soon!", description: "Real-time monitoring will be available soon." })}
                variant="outline"
                className="flex items-center justify-center"
              >
                Monitor Client Changes
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 max-w-2xl mx-auto bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Instructions for your client:</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Click the link to view their personalized itinerary</li>
                <li>Chat with the AI assistant to request modifications</li>
                <li>Approve the final itinerary when ready</li>
                <li>Call or message you directly for complex changes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLinkGenerator;
