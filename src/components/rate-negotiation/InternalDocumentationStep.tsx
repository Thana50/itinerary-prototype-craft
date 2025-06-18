
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Star, Clock, Users } from "lucide-react";

interface InternalDocumentationStepProps {
  negotiation: any;
  onComplete: () => void;
  isCompleted: boolean;
}

const InternalDocumentationStep = ({ negotiation, onComplete, isCompleted }: InternalDocumentationStepProps) => {
  const [learningNotes, setLearningNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const performanceMetrics = {
    duration: "28 hours",
    rounds: 2,
    successRating: 5,
    savingsAchieved: "$325",
    inclusionsValue: "$220"
  };

  const providerUpdates = {
    successRate: "100%",
    responsiveness: 5,
    preferredTerms: ["Volume business emphasis", "Breakfast inclusion automatic", "25% deposit negotiable"]
  };

  const defaultNotes = `Key Insights from this negotiation:
• Provider responds well to volume business mentions
• Breakfast inclusion was automatic - good relationship signal  
• 25% deposit was negotiable - note for future
• Quick response time indicates priority partner status
• Cultural requirements (halal, prayer facilities) were easily accommodated`;

  const handleSaveDocumentation = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Performance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Negotiation Duration</span>
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {performanceMetrics.duration}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Number of Rounds</span>
                <Badge variant="outline">{performanceMetrics.rounds}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rating</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < performanceMetrics.successRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Value Gained</span>
                <Badge className="bg-green-500 text-white">{performanceMetrics.savingsAchieved}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Inclusions Value</span>
                <Badge className="bg-blue-500 text-white">{performanceMetrics.inclusionsValue}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Satisfaction</span>
                <Badge variant="outline">Pending Survey</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            Provider Relationship Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Success Rate Updated</p>
                <p className="font-semibold text-green-600">{providerUpdates.successRate} (maintained)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Responsiveness Rating</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < providerUpdates.responsiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Preferred Terms Based on This Negotiation</p>
              <div className="space-y-1">
                {providerUpdates.preferredTerms.map((term, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-1">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add key insights and learnings from this negotiation..."
            value={learningNotes || defaultNotes}
            onChange={(e) => setLearningNotes(e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {isCompleted ? (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-4 w-4 mr-1" />
            Documentation Saved
          </Badge>
        ) : (
          <Button 
            onClick={handleSaveDocumentation}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Documentation"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InternalDocumentationStep;
