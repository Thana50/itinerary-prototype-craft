
import { useState, useEffect } from 'react';
import { ItineraryTemplate } from '@/types/templates';
import { templateService } from '@/services/templateService';

export const useTemplateIntegration = () => {
  const [showTemplateSidebar, setShowTemplateSidebar] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ItineraryTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Auto-detect destination/trip details from form data
  const detectTemplateRelevance = (formData: any) => {
    const hasDestination = formData.destination && formData.destination.length > 3;
    const hasTripDetails = formData.numberOfTravelers || formData.startDate || formData.endDate;
    
    if (hasDestination || hasTripDetails) {
      setShowTemplateSidebar(true);
      if (hasDestination) {
        setTemplateSearchQuery(formData.destination);
      }
    }
  };

  const handleTemplateSelect = (template: ItineraryTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleTemplateConfirm = (template: ItineraryTemplate) => {
    setShowTemplateModal(false);
    setSelectedTemplate(null);
    return template;
  };

  const handleTemplateCancel = () => {
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  const convertTemplateToItinerary = (template: ItineraryTemplate) => {
    // Convert template structure to the existing itinerary format
    return template.activities.reduce((acc, activity) => {
      const existingDay = acc.find(day => day.day === activity.day);
      if (existingDay) {
        existingDay.activities.push(`${activity.time}: ${activity.title} - ${activity.description}`);
      } else {
        acc.push({
          day: activity.day,
          title: `Day ${activity.day}`,
          activities: [`${activity.time}: ${activity.title} - ${activity.description}`]
        });
      }
      return acc;
    }, [] as any[]).sort((a, b) => a.day - b.day);
  };

  return {
    showTemplateSidebar,
    setShowTemplateSidebar,
    templateSearchQuery,
    setTemplateSearchQuery,
    selectedTemplate,
    showTemplateModal,
    handleTemplateSelect,
    handleTemplateConfirm,
    handleTemplateCancel,
    detectTemplateRelevance,
    convertTemplateToItinerary
  };
};
