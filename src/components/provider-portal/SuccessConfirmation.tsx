
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessConfirmation = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/vendor-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Response Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you! Your response has been submitted successfully.
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Travia will review your offer within 2 business hours</li>
            <li>• You'll receive email confirmation of their decision</li>
            <li>• Your response has been saved to your portal history</li>
          </ul>
          <p className="text-sm text-gray-500 pt-4">
            Need to modify your response? Contact us at partners@travia.com
          </p>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleReturnToDashboard}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-1"
            >
              Return to Dashboard
            </Button>
            <Button 
              onClick={() => window.close()} 
              variant="outline"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Close Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessConfirmation;
