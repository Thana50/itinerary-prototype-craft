
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, Briefcase, DollarSign, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AgentSelector from "@/components/AgentSelector";

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === "agent") {
      navigate("/agent-dashboard");
    } else if (selectedRole === "traveler") {
      navigate("/traveler-dashboard");
    } else if (selectedRole === "vendor") {
      navigate("/vendor-dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-center mb-2">Travel Agency Platform</h1>
            <p className="text-center text-muted-foreground mb-10">
              A platform to streamline collaboration between travel agents, travelers, and vendors
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Your Role</CardTitle>
            <CardDescription>
              Choose how you want to interact with the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentSelector onSelect={handleRoleSelect} selectedRole={selectedRole} />
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleContinue} 
              disabled={!selectedRole}
              className="w-full"
            >
              Continue
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Travel Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and customize travel itineraries for clients, negotiate with vendors, and manage bookings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Traveler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review your itineraries, research options, request modifications, and approve final plans.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Vendor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Negotiate pricing for services, manage availability, and confirm bookings with travel agents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
