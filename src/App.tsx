
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AgentDashboard from "./pages/AgentDashboard";
import CreateItinerary from "./pages/CreateItinerary";
import ItineraryDetail from "./pages/ItineraryDetail";
import SharedItinerary from "./pages/SharedItinerary";
import TravelerDashboard from "./pages/TravelerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import ProviderPortal from "./pages/ProviderPortal";
import PremiumProviderPortalPage from "./pages/PremiumProviderPortal";
import PremiumProviderSuccessPage from "./pages/PremiumProviderSuccess";
import RateNegotiationAI from "./pages/RateNegotiationAI";
import NegotiationRoom from "./pages/NegotiationRoom";
import NegotiationDetail from "./pages/NegotiationDetail";
import ClientAIPortal from "./pages/ClientAIPortal";
import TemplateRepository from "./pages/TemplateRepository";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/create-itinerary" element={<CreateItinerary />} />
            <Route path="/itinerary/:id" element={<ItineraryDetail />} />
            <Route path="/shared/:id" element={<SharedItinerary />} />
            <Route path="/traveler-dashboard" element={<TravelerDashboard />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/provider-portal/:id" element={<ProviderPortal />} />
            <Route path="/premium-provider-portal/:id" element={<PremiumProviderPortalPage />} />
            <Route path="/premium-provider-portal/success" element={<PremiumProviderSuccessPage />} />
            <Route path="/rate-negotiation" element={<RateNegotiationAI />} />
            <Route path="/negotiation-room/:id" element={<NegotiationRoom />} />
            <Route path="/negotiation/:id" element={<NegotiationDetail />} />
            <Route path="/client-portal/:id" element={<ClientAIPortal />} />
            <Route path="/template-repository" element={<TemplateRepository />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
