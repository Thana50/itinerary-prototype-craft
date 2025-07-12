
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import RateNegotiationHeader from "@/components/rate-negotiation/RateNegotiationHeader";
import StatsCards from "@/components/rate-negotiation/StatsCards";
import ActiveNegotiationCard from "@/components/rate-negotiation/ActiveNegotiationCard";
import CompletedNegotiationsTab from "@/components/rate-negotiation/CompletedNegotiationsTab";
import AICommunicationsTab from "@/components/rate-negotiation/AICommunicationsTab";
import ProviderNetworkTab from "@/components/rate-negotiation/ProviderNetworkTab";
import AIIntelligenceDashboard from "@/components/rate-negotiation/AIIntelligenceDashboard";
import AnalyticsReportsDashboard from "@/components/rate-negotiation/AnalyticsReportsDashboard";
import { negotiationService } from "@/services/negotiationService";
import type { Negotiation } from "@/lib/supabase";

import type { ActiveNegotiation } from "@/types/negotiation";

interface ActiveNegotiationDisplay extends ActiveNegotiation {}

const RateNegotiationAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNegotiations();
    }
  }, [user]);

  const loadNegotiations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await negotiationService.getAgentNegotiations(user.id);
      setNegotiations(data);
    } catch (error) {
      console.error('Error loading negotiations:', error);
      toast({
        title: "Error",
        description: "Failed to load negotiations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transform real negotiations into display format
  const transformNegotiationToDisplay = (negotiation: Negotiation): ActiveNegotiationDisplay => {
    const serviceTypeMap: Record<string, "hotel" | "tour" | "transfer" | "restaurant" | "activity"> = {
      'accommodation': 'hotel',
      'tours': 'tour',
      'transportation': 'transfer',
      'dining': 'restaurant',
      'activities': 'activity'
    };

    const statusColorMap: Record<string, string> = {
      'pending': 'bg-blue-500',
      'negotiating': 'bg-yellow-500',
      'accepted': 'bg-green-500',
      'rejected': 'bg-red-500'
    };

    // Get the latest offer from messages
    const messages = Array.isArray(negotiation.messages) ? negotiation.messages : [];
    const latestOffer = messages
      .filter(m => m.price_offer && m.price_offer > 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    return {
      id: negotiation.id,
      provider: `Vendor-${negotiation.vendor_id.slice(-8)}`, // Show last 8 chars of vendor ID
      service: negotiation.description,
      serviceType: serviceTypeMap[negotiation.service_type] || 'activity',
      originalRate: negotiation.original_price || 0,
      targetRate: negotiation.target_price || 0,
      currentOffer: latestOffer?.price_offer || 0,
      status: negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1),
      statusColor: statusColorMap[negotiation.status] || 'bg-gray-500',
      lastUpdate: new Date(negotiation.updated_at).toLocaleString(),
      groupSize: 4, // Default, would come from itinerary in real app
      duration: 1 // Default, would come from itinerary item in real app
    };
  };

  const activeNegotiations = negotiations
    .filter(n => n.status === 'pending' || n.status === 'negotiating')
    .map(transformNegotiationToDisplay);

  const stats = {
    totalNegotiations: negotiations.length,
    activeNegotiations: activeNegotiations.length,
    completedNegotiations: negotiations.filter(n => n.status === 'accepted' || n.status === 'rejected').length,
    averageSavings: activeNegotiations.length > 0 
      ? Math.round(activeNegotiations.reduce((sum, n) => {
          const savings = n.originalRate > 0 ? ((n.originalRate - (n.currentOffer || n.targetRate)) / n.originalRate) * 100 : 0;
          return sum + savings;
        }, 0) / activeNegotiations.length)
      : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading negotiations...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <RateNegotiationHeader />
      
      <div className="container mx-auto px-6 py-8">
        <StatsCards 
          totalNegotiations={stats.totalNegotiations}
          activeNegotiations={stats.activeNegotiations}
          completedNegotiations={stats.completedNegotiations}
          averageSavings={stats.averageSavings}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="active">Active Negotiations</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="communications">AI Communications</TabsTrigger>
            <TabsTrigger value="providers">Provider Network</TabsTrigger>
            <TabsTrigger value="ai-intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-6">
              {activeNegotiations.length > 0 ? (
                activeNegotiations.map((negotiation) => (
                  <ActiveNegotiationCard key={negotiation.id} negotiation={negotiation} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-4">No active negotiations</p>
                  <p>Start negotiations from approved itineraries on your dashboard.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <CompletedNegotiationsTab />
          </TabsContent>

          <TabsContent value="communications">
            <AICommunicationsTab />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderNetworkTab />
          </TabsContent>

          <TabsContent value="ai-intelligence">
            <AIIntelligenceDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsReportsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RateNegotiationAI;
