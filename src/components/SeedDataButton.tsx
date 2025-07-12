
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { createSeedData } from "@/utils/seedData";
import { useToast } from "@/hooks/use-toast";

const SeedDataButton: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateSeedData = async () => {
    setIsCreating(true);
    try {
      const result = await createSeedData();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default"
        });
        
        // Refresh the page to show new data
        window.location.reload();
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

  return (
    <Button
      onClick={handleCreateSeedData}
      disabled={isCreating}
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
  );
};

export default SeedDataButton;
