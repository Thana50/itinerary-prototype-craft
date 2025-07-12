
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send,
  Camera,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: string;
  activityName: string;
  location: string;
  date: string;
  rating?: number;
  feedback?: string;
  photos?: string[];
  status: 'pending' | 'submitted';
}

interface ClientFeedbackSystemProps {
  itineraryId: string;
}

const ClientFeedbackSystem = ({ itineraryId }: ClientFeedbackSystemProps) => {
  const { toast } = useToast();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: '1',
      activityName: 'Phi Phi Islands Tour',
      location: 'Phi Phi Islands',
      date: 'March 16, 2025',
      status: 'pending'
    },
    {
      id: '2',
      activityName: 'Thai Cooking Class',
      location: 'Phuket Town',
      date: 'March 17, 2025',
      rating: 5,
      feedback: 'Amazing experience! The chef was so patient and the food was delicious.',
      status: 'submitted'
    },
    {
      id: '3',
      activityName: 'Elephant Sanctuary Visit',
      location: 'Phuket Elephant Sanctuary',
      date: 'March 18, 2025',
      status: 'pending'
    }
  ]);

  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<number>(0);
  const [tempFeedback, setTempFeedback] = useState<string>('');

  const handleRatingClick = (rating: number) => {
    setTempRating(rating);
  };

  const handleSubmitFeedback = (itemId: string) => {
    if (tempRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting your feedback.",
        variant: "destructive"
      });
      return;
    }

    setFeedbackItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            rating: tempRating, 
            feedback: tempFeedback,
            status: 'submitted' as const
          }
        : item
    ));

    setActiveFeedback(null);
    setTempRating(0);
    setTempFeedback('');

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve your experience.",
    });
  };

  const handleStartFeedback = (itemId: string) => {
    const item = feedbackItems.find(f => f.id === itemId);
    if (item && item.status === 'submitted') {
      setTempRating(item.rating || 0);
      setTempFeedback(item.feedback || '');
    } else {
      setTempRating(0);
      setTempFeedback('');
    }
    setActiveFeedback(itemId);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const getOverallRating = () => {
    const ratedItems = feedbackItems.filter(item => item.rating && item.rating > 0);
    if (ratedItems.length === 0) return 0;
    
    const total = ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (total / ratedItems.length).toFixed(1);
  };

  const completedActivities = feedbackItems.filter(item => item.status === 'submitted').length;
  const totalActivities = feedbackItems.length;

  return (
    <div className="space-y-6">
      {/* Feedback Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Travel Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{getOverallRating()}</div>
              <div className="text-sm text-purple-700 mb-2">Overall Rating</div>
              {renderStars(Math.round(Number(getOverallRating())))}
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedActivities}/{totalActivities}</div>
              <div className="text-sm text-blue-700">Activities Reviewed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((completedActivities / totalActivities) * 100)}%
              </div>
              <div className="text-sm text-green-700">Feedback Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Activity Feedback */}
      <div className="space-y-4">
        {feedbackItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{item.activityName}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'submitted' ? (
                    <Badge className="bg-green-500 text-white">
                      Reviewed
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Pending Review
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.status === 'submitted' && activeFeedback !== item.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Your Rating:</span>
                    {renderStars(item.rating || 0)}
                  </div>
                  {item.feedback && (
                    <div>
                      <span className="text-sm font-medium">Your Feedback:</span>
                      <p className="text-gray-700 mt-1">{item.feedback}</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartFeedback(item.id)}
                  >
                    Edit Review
                  </Button>
                </div>
              ) : activeFeedback === item.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rate this experience:</label>
                    {renderStars(tempRating, true, handleRatingClick)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Share your thoughts:</label>
                    <Textarea
                      placeholder="Tell us about your experience..."
                      value={tempFeedback}
                      onChange={(e) => setTempFeedback(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSubmitFeedback(item.id)}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveFeedback(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600 mb-4">How was your experience?</p>
                  <Button onClick={() => handleStartFeedback(item.id)}>
                    Leave a Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Trip Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Trip Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50"
              >
                <ThumbsUp className="h-6 w-6 text-green-600" />
                <span className="text-sm">Great Trip!</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-red-50"
              >
                <ThumbsDown className="h-6 w-6 text-red-600" />
                <span className="text-sm">Needs Improvement</span>
              </Button>
            </div>
            <Textarea
              placeholder="Any additional feedback about your overall trip experience?"
              rows={3}
            />
            <Button className="w-full">
              Submit Overall Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFeedbackSystem;
