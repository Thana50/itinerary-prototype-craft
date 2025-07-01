
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface IncludedServicesSectionProps {
  includedServices: Record<string, boolean>;
  onServiceChange: (service: string, checked: boolean) => void;
}

const IncludedServicesSection = ({ includedServices, onServiceChange }: IncludedServicesSectionProps) => {
  const services = [
    { key: 'breakfast', label: 'Complimentary breakfast' },
    { key: 'transfers', label: 'Airport transfers' },
    { key: 'welcome', label: 'Welcome drink upon arrival' },
    { key: 'checkout', label: 'Late check-out (subject to availability)' },
    { key: 'upgrade', label: 'Room upgrade (subject to availability)' },
    { key: 'spa', label: 'Spa/facility discounts' }
  ];

  return (
    <div>
      <Label className="text-base font-medium">Included Services</Label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {services.map(service => (
          <div key={service.key} className="flex items-center space-x-2">
            <Checkbox
              id={service.key}
              checked={includedServices[service.key]}
              onCheckedChange={(checked) => onServiceChange(service.key, checked as boolean)}
            />
            <Label htmlFor={service.key} className="text-sm">{service.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncludedServicesSection;
