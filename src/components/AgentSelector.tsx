
import React from "react";
import { Briefcase, Users, DollarSign } from "lucide-react";

interface AgentSelectorProps {
  onSelect: (role: string) => void;
  selectedRole: string | null;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ onSelect, selectedRole }) => {
  const roles = [
    { id: "agent", title: "Travel Agent", icon: <Briefcase className="h-6 w-6" />, description: "Create itineraries and negotiate with vendors" },
    { id: "traveler", title: "Traveler", icon: <Users className="h-6 w-6" />, description: "Review and modify itineraries" },
    { id: "vendor", title: "Vendor", icon: <DollarSign className="h-6 w-6" />, description: "Negotiate service pricing" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedRole === role.id
              ? "border-primary bg-primary/10"
              : "hover:border-primary/50"
          }`}
          onClick={() => onSelect(role.id)}
        >
          <div className="flex flex-col items-center text-center">
            {role.icon}
            <h3 className="font-medium mt-2">{role.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentSelector;
