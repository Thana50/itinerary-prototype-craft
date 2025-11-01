import { useState, useEffect } from 'react';
import { ItineraryTemplate } from '@/types/templates';
import { templateService } from '@/services/templateService';
import { generateSampleItinerary } from '@/utils/itineraryGenerator';

export const useTemplateIntegration = () => {
  const [showTemplateSidebar, setShowTemplateSidebar] = useState(true);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ItineraryTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [userHasManuallyClosedSidebar, setUserHasManuallyClosedSidebar] = useState(false);

  // Auto-detect destination/trip details from form data
  const detectTemplateRelevance = (formData: any) => {
    const hasDestination = formData.destination && formData.destination.length > 3;
    const hasTripDetails = formData.numberOfTravelers || formData.startDate || formData.endDate;
    
    // Only auto-show sidebar if user hasn't manually closed it and there's destination/trip info
    if ((hasDestination || hasTripDetails) && !showTemplateSidebar && !userHasManuallyClosedSidebar) {
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
    // Close sidebar after template is applied
    setShowTemplateSidebar(false);
    return template;
  };

  const handleTemplateCancel = () => {
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  const toggleTemplateSidebar = () => {
    const newState = !showTemplateSidebar;
    setShowTemplateSidebar(newState);
    
    // If user is closing the sidebar, mark that they manually closed it
    if (!newState) {
      setUserHasManuallyClosedSidebar(true);
    } else {
      // If user is opening it manually, reset the flag
      setUserHasManuallyClosedSidebar(false);
    }
  };

  const convertTemplateToItinerary = (template: ItineraryTemplate) => {
    // Convert template structure to the existing itinerary format
    const converted = template.activities.reduce((acc, activity) => {
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
    
    // Fallback: If template has fewer days than duration, use sample itinerary generator
    if (converted.length < template.duration) {
      console.warn(`Template "${template.name}" has incomplete activities (${converted.length}/${template.duration} days). Using fallback generator.`);
      return generateSampleItinerary(template.destination, `${template.duration} days`);
    }
    
    return converted;
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
    convertTemplateToItinerary,
    toggleTemplateSidebar
  };
};
