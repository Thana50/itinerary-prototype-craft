
import React from 'react';
import { Search } from 'lucide-react';
import { ItineraryTemplate } from '@/types/templates';
import TemplateCard from './TemplateCard';

interface TemplateSearchSectionProps {
  templates: ItineraryTemplate[];
  searchQuery: string;
  isLoading: boolean;
  onTemplateSelect: (template: ItineraryTemplate) => void;
}

const TemplateSearchSection: React.FC<TemplateSearchSectionProps> = ({
  templates,
  searchQuery,
  isLoading,
  onTemplateSelect
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">No templates found</p>
        <p className="text-xs text-gray-400">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
          showExtendedInfo={true}
        />
      ))}
    </div>
  );
};

export default TemplateSearchSection;
