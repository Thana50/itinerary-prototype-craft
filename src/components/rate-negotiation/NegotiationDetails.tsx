
import React from "react";

interface ActiveNegotiation {
  serviceType: "hotel" | "tour" | "transfer";
  originalRate: number;
  targetRate: number;
  currentOffer: number;
}

interface NegotiationDetailsProps {
  negotiation: ActiveNegotiation;
}

const NegotiationDetails = ({ negotiation }: NegotiationDetailsProps) => {
  const getRateUnit = () => {
    return negotiation.serviceType === 'hotel' ? '/night' : 
           negotiation.serviceType === 'tour' ? ' total' : '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <p className="text-sm text-gray-500">Original Rate</p>
        <p className="font-semibold text-gray-900">${negotiation.originalRate}{getRateUnit()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Target Rate</p>
        <p className="font-semibold text-green-600">${negotiation.targetRate}{getRateUnit()}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Current Offer</p>
        <p className="font-semibold text-blue-600">
          {negotiation.currentOffer === 0 ? "Pending Response" : `$${negotiation.currentOffer}${getRateUnit()}`}
        </p>
      </div>
    </div>
  );
};

export default NegotiationDetails;
