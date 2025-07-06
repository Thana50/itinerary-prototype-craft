
import React from "react";
import { useWorkflowActions } from "@/hooks/useWorkflowActions";

interface WorkflowActionsProps {
  onApproval: () => void;
  onCall: () => void;
  onSave: () => void;
  onShare: () => void;
  onPrint: () => void;
  children: (handlers: {
    handleApproval: () => void;
    handleCall: () => void;
    handleSave: () => void;
    handleShare: () => void;
    handlePrint: () => void;
  }) => React.ReactNode;
}

const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  onApproval,
  onCall,
  onSave,
  onShare,
  onPrint,
  children
}) => {
  const handlers = useWorkflowActions({
    onApproval,
    onCall,
    onSave,
    onShare,
    onPrint
  });

  return <>{children(handlers)}</>;
};

export default WorkflowActions;
