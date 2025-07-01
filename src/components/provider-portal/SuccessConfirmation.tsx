
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const SuccessConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-800">Response Submitted Successfully!</CardTitle>
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
          <Button 
            onClick={() => window.close()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Close Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessConfirmation;
