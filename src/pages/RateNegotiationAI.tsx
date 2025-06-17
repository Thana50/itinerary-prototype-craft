
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RateNegotiationHeader from "@/components/rate-negotiation/RateNegotiationHeader";
import StatsCards from "@/components/rate-negotiation/StatsCards";
import ActiveNegotiationCard from "@/components/rate-negotiation/ActiveNegotiationCard";
import CompletedNegotiationsTab from "@/components/rate-negotiation/CompletedNegotiationsTab";
import ProviderNetworkTab from "@/components/rate-negotiation/ProviderNetworkTab";

const RateNegotiationAI = () => {
  const activeNegotiations = [
    {
      id: 1,
      provider: "Phuket Beach Resort & Spa",
      service: "Superior Ocean View Room",
      serviceType: "hotel" as const,
      originalRate: 180,
      targetRate: 150,
      currentOffer: 165,
      status: "Negotiating",
      statusColor: "bg-yellow-500",
      lastUpdate: "2 hours ago",
      groupSize: 4,
      duration: 7
    },
    {
      id: 2,
      provider: "Phi Phi Island Tours",
      service: "Private Speedboat Tour (4 people)",
      serviceType: "tour" as const,
      originalRate: 320,
      targetRate: 280,
      currentOffer: 0, // Pending response
      status: "Sent",
      statusColor: "bg-blue-500",
      lastUpdate: "4 hours ago",
      groupSize: 4,
      duration: 1
    },
    {
      id: 3,
      provider: "Bangkok Airport Transfers",
      service: "Private Van Transfer",
      serviceType: "transfer" as const,
      originalRate: 45,
      targetRate: 35,
      currentOffer: 40,
      status: "Counter Received",
      statusColor: "bg-orange-500",
      lastUpdate: "30 minutes ago",
      groupSize: 4,
      duration: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <RateNegotiationHeader />

      <div className="container mx-auto px-6 py-8">
        <StatsCards />

        {/* Main Content Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Negotiations</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="providers">Provider Network</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-6">
              {activeNegotiations.map((negotiation) => (
                <ActiveNegotiationCard key={negotiation.id} negotiation={negotiation} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <CompletedNegotiationsTab />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderNetworkTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RateNegotiationAI;
