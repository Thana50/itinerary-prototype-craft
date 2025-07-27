
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { templateService } from '@/services/templateService';
import { ItineraryTemplate } from '@/types/templates';
import SidebarHeader from './SidebarHeader';
import PopularTemplatesSection from './PopularTemplatesSection';
import RecentTemplatesSection from './RecentTemplatesSection';
import TemplateSearchSection from './TemplateSearchSection';

interface TemplateSidebarProps {
  searchQuery: string;
  onTemplateSelect: (template: ItineraryTemplate) => void;
  onSearchChange: (query: string) => void;
  isVisible: boolean;
  onToggleSidebar: () => void;
  onContinueWithoutTemplate?: () => void;
}

const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
  searchQuery,
  onTemplateSelect,
  onSearchChange,
  isVisible,
  onToggleSidebar,
  onContinueWithoutTemplate
}) => {
  const [templates, setTemplates] = useState<ItineraryTemplate[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<ItineraryTemplate[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<ItineraryTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const results = await templateService.searchTemplates(searchQuery);
        setTemplates(results);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [searchQuery]);

  useEffect(() => {
    const fetchPopularAndRecent = async () => {
      try {
        const [popular, recent] = await Promise.all([
          templateService.getPopularTemplates(),
          templateService.getRecentTemplates()
        ]);
        setPopularTemplates(popular);
        setRecentTemplates(recent);
      } catch (error) {
        console.error('Failed to fetch popular/recent templates:', error);
      }
    };

    if (isVisible) {
      fetchPopularAndRecent();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto fixed right-0 top-0 z-40">
      <SidebarHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onToggleSidebar={onToggleSidebar}
      />

      <div className="p-4 space-y-6">
        {!searchQuery && (
          <>
            <PopularTemplatesSection
              templates={popularTemplates}
              onTemplateSelect={onTemplateSelect}
            />

            <Separator />

            <RecentTemplatesSection
              templates={recentTemplates}
              onTemplateSelect={onTemplateSelect}
            />

            <Separator />
          </>
        )}

        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            {searchQuery ? `Search Results (${templates.length})` : 'All Templates'}
          </h3>
          
          <TemplateSearchSection
            templates={templates}
            searchQuery={searchQuery}
            isLoading={isLoading}
            onTemplateSelect={onTemplateSelect}
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        {onContinueWithoutTemplate && (
          <button
            onClick={() => {
              onContinueWithoutTemplate();
              onToggleSidebar();
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Continue without template
          </button>
        )}
        <p className="text-xs text-center text-gray-500">
          <span className="font-medium">Travia</span> - Where Custom Trips Click
        </p>
      </div>
    </div>
  );
};

export default TemplateSidebar;
