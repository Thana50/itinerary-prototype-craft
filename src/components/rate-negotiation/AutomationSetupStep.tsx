
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Clock, Bell, Calendar, Users } from "lucide-react";

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

  const handleBookingReminderChange = (key: string, checked: boolean) => {
    setBookingReminders(prev => ({ ...prev, [key]: checked }));
  };

  const handleProviderCoordinationChange = (key: string, checked: boolean) => {
    setProviderCoordination(prev => ({ ...prev, [key]: checked }));
  };

  const handleSetupAutomation = async () => {
    setIsSettingUp(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSettingUp(false);
    onComplete();
  };

  const allRemindersSelected = Object.values(bookingReminders).every(Boolean);
  const allCoordinationSelected = Object.values(providerCoordination).every(Boolean);
  const allActionsSelected = allRemindersSelected && allCoordinationSelected;

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
            <div className="flex items-center space-x-3">
              <Checkbox
                id="depositReminder"
                checked={bookingReminders.depositReminder}
                onCheckedChange={(checked) => handleBookingReminderChange('depositReminder', checked as boolean)}
              />
              <label htmlFor="depositReminder" className="text-sm font-medium flex-1">
                Send deposit reminder to client (due March 5)
              </label>
              <Badge variant="outline" className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                5 days before
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="preArrivalDetails"
                checked={bookingReminders.preArrivalDetails}
                onCheckedChange={(checked) => handleBookingReminderChange('preArrivalDetails', checked as boolean)}
              />
              <label htmlFor="preArrivalDetails" className="text-sm font-medium flex-1">
                Send pre-arrival details (March 10)
              </label>
              <Badge variant="outline" className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                5 days before
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkInConfirmation"
                checked={bookingReminders.checkInConfirmation}
                onCheckedChange={(checked) => handleBookingReminderChange('checkInConfirmation', checked as boolean)}
              />
              <label htmlFor="checkInConfirmation" className="text-sm font-medium flex-1">
                Send check-in confirmation (March 15)
              </label>
              <Badge variant="outline" className="flex items-center">
                <Bell className="h-3 w-3 mr-1" />
                Day of arrival
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="postStayReview"
                checked={bookingReminders.postStayReview}
                onCheckedChange={(checked) => handleBookingReminderChange('postStayReview', checked as boolean)}
              />
              <label htmlFor="postStayReview" className="text-sm font-medium flex-1">
                Schedule post-stay review request (March 23)
              </label>
              <Badge variant="outline" className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                1 day after
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 text-green-600 mr-2" />
            Provider Coordination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="bookingConfirmation"
                checked={providerCoordination.bookingConfirmation}
                onCheckedChange={(checked) => handleProviderCoordinationChange('bookingConfirmation', checked as boolean)}
              />
              <label htmlFor="bookingConfirmation" className="text-sm font-medium flex-1">
                Send final booking confirmation to resort
              </label>
              <Badge className="bg-green-500 text-white">Immediate</Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="specialRequirements"
                checked={providerCoordination.specialRequirements}
                onCheckedChange={(checked) => handleProviderCoordinationChange('specialRequirements', checked as boolean)}
              />
              <label htmlFor="specialRequirements" className="text-sm font-medium flex-1">
                Confirm special requirements (halal, prayer facilities)
              </label>
              <Badge className="bg-blue-500 text-white">Within 24h</Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="volumeTracking"
                checked={providerCoordination.volumeTracking}
                onCheckedChange={(checked) => handleProviderCoordinationChange('volumeTracking', checked as boolean)}
              />
              <label htmlFor="volumeTracking" className="text-sm font-medium flex-1">
                Add to monthly volume tracking
              </label>
              <Badge variant="outline">Monthly report</Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="relationshipReview"
                checked={providerCoordination.relationshipReview}
                onCheckedChange={(checked) => handleProviderCoordinationChange('relationshipReview', checked as boolean)}
              />
              <label htmlFor="relationshipReview" className="text-sm font-medium flex-1">
                Schedule relationship review call
              </label>
              <Badge variant="outline">Quarterly</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Automation Setup Complete
          </Badge>
        ) : (
          <Button 
            onClick={handleSetupAutomation}
            disabled={!allActionsSelected || isSettingUp}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            {isSettingUp ? "Setting Up..." : "Setup Automation"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AutomationSetupStep;
