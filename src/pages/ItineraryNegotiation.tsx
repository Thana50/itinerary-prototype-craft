import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ItineraryNegotiationSelector from "@/components/negotiation/ItineraryNegotiationSelector";

const ItineraryNegotiation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleItemsSelected = (selectedItems: any[]) => {
    // Navigate to bulk negotiation orchestrator or individual negotiations
    console.log('Selected items for negotiation:', selectedItems);
    // For now, navigate back to rate negotiation with the data
    navigate('/rate-negotiation', { state: { selectedItems, itineraryId: id } });
  };

  const handleCancel = () => {
    navigate('/agent-dashboard');
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Itinerary</h1>
          <Button onClick={() => navigate('/agent-dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Select Items for Rate Negotiation
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <ItineraryNegotiationSelector
          itineraryId={id}
          itineraryName="Selected Itinerary"
          onItemsSelected={handleItemsSelected}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ItineraryNegotiation;