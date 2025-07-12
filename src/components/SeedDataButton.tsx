
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2, TestTube, CheckCircle, AlertTriangle, Route } from "lucide-react";
import { createSeedData, testCRUDOperations } from "@/utils/seedData";
import { runComprehensiveTests, validateDataConsistency } from "@/utils/testValidation";
import { runAllJourneyTests, formatTestResults } from "@/utils/journeyVerification";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SeedDataButton: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateSeedData = async () => {
    setIsCreating(true);
    try {
      const result = await createSeedData();
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          variant: "default"
        });
        
        // Show detailed results if available
        if (result.details) {
          console.log('Seed data creation details:', result.details);
          
          // Show additional info in a follow-up toast
          setTimeout(() => {
            toast({
              title: "Seed Data Details",
              description: `Created: ${result.details.itineraries} itineraries, ${result.details.negotiations} negotiations`,
              variant: "default"
            });
          }, 1000);
        }
        
        // Refresh the page to show new data
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create seed data",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestCRUD = async () => {
    setIsTesting(true);
    try {
      const result = await testCRUDOperations();
      
      if (result.success) {
        toast({
          title: "CRUD Tests Passed!",
          description: result.message,
          variant: "default"
        });
      } else {
        toast({
          title: "CRUD Tests Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run CRUD tests",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleComprehensiveTest = async () => {
    setIsValidating(true);
    try {
      const [testResults, consistencyResults] = await Promise.all([
        runComprehensiveTests(),
        validateDataConsistency()
      ]);

      const allResults = [...testResults, ...consistencyResults];
      const passedTests = allResults.filter(r => r.success).length;
      const totalTests = allResults.length;

      // Log detailed results to console
      console.log('=== Comprehensive Test Results ===');
      allResults.forEach(result => {
        console.log(`${result.success ? '✅' : '❌'} ${result.testName}: ${result.message}`);
        if (result.details) {
          console.log('   Details:', result.details);
        }
      });

      if (passedTests === totalTests) {
        toast({
          title: "All Tests Passed! 🎉",
          description: `${passedTests}/${totalTests} tests completed successfully`,
          variant: "default"
        });
      } else {
        toast({
          title: "Some Tests Failed",
          description: `${passedTests}/${totalTests} tests passed. Check console for details.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      toast({
        title: "Testing Error",
        description: "Failed to run comprehensive tests",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleJourneyVerification = async () => {
    if (!user) return;
    
    setIsVerifying(true);
    try {
      const results = await runAllJourneyTests(user.id, user.role);
      const formattedResults = formatTestResults(results);
      
      console.log(formattedResults);
      
      const passed = results.filter(r => r.status === 'passed').length;
      const failed = results.filter(r => r.status === 'failed').length;
      const total = results.length;
      
      if (failed === 0) {
        toast({
          title: "All Journeys Verified! 🎉",
          description: `${passed}/${total} user journeys working correctly`,
          variant: "default"
        });
      } else {
        toast({
          title: "Journey Issues Found",
          description: `${passed}/${total} journeys passed. Check console for details.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify user journeys",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const isAnyOperationRunning = isCreating || isTesting || isValidating || isVerifying;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleCreateSeedData}
        disabled={isAnyOperationRunning}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        {isCreating ? "Creating..." : "Create Sample Data"}
      </Button>

      <Button
        onClick={handleTestCRUD}
        disabled={isAnyOperationRunning}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isTesting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <TestTube className="h-4 w-4" />
        )}
        {isTesting ? "Testing..." : "Test CRUD"}
      </Button>

      <Button
        onClick={handleComprehensiveTest}
        disabled={isAnyOperationRunning}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isValidating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        {isValidating ? "Validating..." : "Full Test Suite"}
      </Button>

      <Button
        onClick={handleJourneyVerification}
        disabled={isAnyOperationRunning}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isVerifying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Route className="h-4 w-4" />
        )}
        {isVerifying ? "Verifying..." : "Verify Journeys"}
      </Button>
    </div>
  );
};

export default SeedDataButton;
