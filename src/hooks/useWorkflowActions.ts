
interface UseWorkflowActionsProps {
  onApproval: () => void;
  onCall: () => void;
  onSave: () => void;
  onShare: () => void;
  onPrint: () => void;
}

export const useWorkflowActions = ({
  onApproval,
  onCall,
  onSave,
  onShare,
  onPrint
}: UseWorkflowActionsProps) => {
  const handleApproval = () => {
    alert('Itinerary Approved!');
    onApproval();
  };

  const handleCall = () => {
    alert('Requesting agent call...');
    onCall();
  };

  const handleSave = () => {
    alert('Saving changes...');
    onSave();
  };

  const handleShare = () => {
    alert('Sharing itinerary...');
    onShare();
  };

  const handlePrint = () => {
    alert('Printing itinerary...');
    onPrint();
  };

  return {
    handleApproval,
    handleCall,
    handleSave,
    handleShare,
    handlePrint
  };
};
