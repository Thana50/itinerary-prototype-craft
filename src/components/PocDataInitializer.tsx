
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { pocDemoDataService } from "@/services/pocDemoDataService";
import { toast } from "@/hooks/use-toast";

const PocDataInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitializeData = async () => {
    console.log('=== PoC Data Initialization Started ===');
    setIsInitializing(true);
    
    try {
      const success = await pocDemoDataService.initializePocData();
      console.log('=== PoC Data Initialization Result ===', { success });
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Success",
          description: "PoC demo data has been initialized successfully!",
        });
        console.log('✅ PoC demo data initialization completed successfully');
      } else {
        toast({
          title: "Warning",
          description: "Some demo data may not have been initialized properly. Check console for details.",
          variant: "destructive"
        });
        console.warn('⚠️ PoC demo data initialization completed with warnings');
      }
    } catch (error) {
      console.error('❌ Error initializing PoC data:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      toast({
        title: "Error",
        description: "Failed to initialize demo data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
      console.log('=== PoC Data Initialization Ended ===');
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          PoC Demo Data
        </CardTitle>
        <CardDescription>
          Initialize comprehensive demo data for the travel booking PoC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            This will create:
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>Comprehensive vendor profile for vendor@demo.com</li>
              <li>Multiple vendor services (hotels, tours, transport)</li>
              <li>Sample itinerary assigned to traveler@demo.com</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleInitializeData}
            disabled={isInitializing || isInitialized}
            className="w-full"
          >
            {isInitializing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : isInitialized ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Initialized
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Initialize Demo Data
              </Button>
            )}
          </Button>
          
          {isInitialized && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Demo data is ready for testing!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PocDataInitializer;
