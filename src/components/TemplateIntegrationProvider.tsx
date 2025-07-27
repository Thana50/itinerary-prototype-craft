
import React from "react";
import TemplateSidebar from "./templates/TemplateSidebar";
import TemplateConfirmationModal from "./templates/TemplateConfirmationModal";
import { ItineraryTemplate } from "@/types/templates";

interface TemplateIntegrationProviderProps {
  showTemplateSidebar: boolean;
  templateSearchQuery: string;
  onSearchChange: (query: string) => void;
  onTemplateSelect: (template: ItineraryTemplate) => void;
  showTemplateModal: boolean;
  selectedTemplate: ItineraryTemplate | null;
  onTemplateConfirm: () => void;
  onTemplateCancel: () => void;
  onToggleSidebar: () => void;
  onContinueWithoutTemplate?: () => void;
}

const TemplateIntegrationProvider: React.FC<TemplateIntegrationProviderProps> = ({
  showTemplateSidebar,
  templateSearchQuery,
  onSearchChange,
  onTemplateSelect,
  showTemplateModal,
  selectedTemplate,
  onTemplateConfirm,
  onTemplateCancel,
  onToggleSidebar,
  onContinueWithoutTemplate
}) => {
  return (
    <>
      {/* Template Sidebar */}
      <TemplateSidebar
        searchQuery={templateSearchQuery}
        onTemplateSelect={onTemplateSelect}
        onSearchChange={onSearchChange}
        isVisible={showTemplateSidebar}
        onToggleSidebar={onToggleSidebar}
        onContinueWithoutTemplate={onContinueWithoutTemplate}
      />

      {/* Template Confirmation Modal */}
      {showTemplateModal && selectedTemplate && (
        <TemplateConfirmationModal
          template={selectedTemplate}
          onConfirm={onTemplateConfirm}
          onCancel={onTemplateCancel}
        />
      )}
    </>
  );
};

export default TemplateIntegrationProvider;
