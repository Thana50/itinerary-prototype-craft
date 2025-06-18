
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Calendar, Bell, Users } from "lucide-react";

interface AutomationSetupStepProps {
  negotiation: any;
  onComplete: () => void;
  isCompleted: boolean;
}

const AutomationSetupStep = ({ negotiation, onComplete, isCompleted }: AutomationSetupStepProps) => {
  const [bookingReminders, setBookingReminders] = useState({
    depositReminder: false,
    preArrivalDetails: false,
    checkInConfirmation: false,
    postStayReview: false
  });

  const [providerCoordination, setProviderCoordination] = useState({
    bookingConfirmation: false,
    specialRequirements: false,
    volumeTracking: false,
    relationshipReview: false
  });

  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleBookingReminderChange = (reminder: string, checked: boolean) => {
    setBookingReminders(prev => ({ ...prev, [reminder]: checked }));
  };

  const handleProviderCoordinationChange = (item: string, checked: boolean) => {
    setProviderCoordination(prev => ({ ...prev, [item]: checked }));
  };

  const handleSetupAutomation = async () => {
    setIsSettingUp(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSettingUp(false);
    onComplete();
  };

  const bookingReminderItems = [
    { key: 'depositReminder', label: 'Send deposit reminder to client (due March 5)', icon: Bell },
    { key: 'preArrivalDetails', label: 'Send pre-arrival details (March 10)', icon: Calendar },
    { key: 'checkInConfirmation', label: 'Send check-in confirmation (March 15)', icon: CheckCircle },
    { key: 'postStayReview', label: 'Schedule post-stay review request (March 23)', icon: Calendar }
  ];

  const providerCoordinationItems = [
    { key: 'bookingConfirmation', label: 'Send final booking confirmation to resort', icon: CheckCircle },
    { key: 'specialRequirements', label: 'Confirm special requirements (halal, prayer facilities)', icon: Users },
    { key: 'volumeTracking', label: 'Add to monthly volume tracking', icon: Calendar },
    { key: 'relationshipReview', label: 'Schedule relationship review call', icon: Bell }
  ];

  const allRemindersSelected = Object.values(bookingReminders).every(Boolean);
  const allCoordinationSelected = Object.values(providerCoordination).every(Boolean);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            Booking Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingReminderItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    checked={bookingReminders[item.key as keyof typeof bookingReminders]}
                    onCheckedChange={(checked) => handleBookingReminderChange(item.key, checked as boolean)}
                  />
                  <IconComponent className="h-4 w-4 text-gray-500" />
                  <label 
                    htmlFor={item.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            Provider Coordination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providerCoordinationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    checked={providerCoordination[item.key as keyof typeof providerCoordination]}
                    onCheckedChange={(checked) => handleProviderCoordinationChange(item.key, checked as boolean)}
                  />
                  <IconComponent className="h-4 w-4 text-gray-500" />
                  <label 
                    htmlFor={item.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Success Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-700">Itinerary updated with negotiated rates</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">Client communication sent</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">Provider relationship updated</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">Savings tracked: $325 total value</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">Booking confirmed and scheduled</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm text-gray-700">
              <strong>Negotiation Performance:</strong> 5/5 stars
            </p>
            <p className="text-sm text-gray-700">
              <strong>Time saved vs manual negotiation:</strong> 85%
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Automation Configured
          </Badge>
        ) : (
          <Button 
            onClick={handleSetupAutomation}
            disabled={!allRemindersSelected || !allCoordinationSelected || isSettingUp}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSettingUp ? "Setting Up..." : "Setup Automation"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AutomationSetupStep;
