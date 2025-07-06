
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ItineraryTemplate } from '@/types/templates';
import TemplateCard from './TemplateCard';

interface PopularTemplatesSectionProps {
  templates: ItineraryTemplate[];
  onTemplateSelect: (template: ItineraryTemplate) => void;
}

const PopularTemplatesSection: React.FC<PopularTemplatesSectionProps> = ({
  templates,
  onTemplateSelect
}) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <h3 className="font-medium text-gray-900">Popular Templates</h3>
      </div>
      <div className="space-y-2">
        {templates.slice(0, 3).map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
            showExtendedInfo={false}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularTemplatesSection;
