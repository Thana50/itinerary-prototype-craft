
import React from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActiveNegotiation } from "@/types/negotiation";

interface NegotiationHeaderProps {
  negotiation: ActiveNegotiation;
}

const NegotiationHeader = ({ negotiation }: NegotiationHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-lg font-semibold text-purple-900">
          {negotiation.provider}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          {negotiation.service}
        </CardDescription>
      </div>
      <Badge className={`${negotiation.statusColor} text-white`}>
        {negotiation.status}
      </Badge>
    </div>
  );
};

export default NegotiationHeader;
