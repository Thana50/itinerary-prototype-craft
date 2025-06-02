
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Save, Share2, Printer } from "lucide-react";

interface ApprovalWorkflowProps {
  onApproveItinerary: () => void;
  onRequestCall: () => void;
  onSaveChanges: () => void;
  onShareItinerary: () => void;
  onPrintItinerary: () => void;
}

const ApprovalWorkflow = ({
  onApproveItinerary,
  onRequestCall,
  onSaveChanges,
  onShareItinerary,
  onPrintItinerary
}: ApprovalWorkflowProps) => {
  return (
    <>
      {/* Approval Workflow */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button 
            onClick={onApproveItinerary} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve This Itinerary
          </Button>
          <Button 
            onClick={onRequestCall} 
            variant="outline" 
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Phone className="h-4 w-4 mr-2" />
            Request Agent Call
          </Button>
          <Button 
            onClick={onSaveChanges} 
            variant="outline" 
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes & Continue Later
          </Button>
        </CardContent>
      </Card>

      {/* Share and Print Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onShareItinerary} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Companion
            </Button>
            <Button variant="outline" onClick={onPrintItinerary} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApprovalWorkflow;
