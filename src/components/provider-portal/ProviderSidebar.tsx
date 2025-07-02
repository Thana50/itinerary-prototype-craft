
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Download } from "lucide-react";

const ProviderSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
            <Phone className="h-4 w-4 mr-2" />
            Request Phone Call
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSidebar;
