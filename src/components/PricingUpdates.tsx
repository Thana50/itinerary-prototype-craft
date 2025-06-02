
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

interface PricingUpdatesProps {
  totalPrice: number;
  modifications: Modification[];
}

const PricingUpdates = ({ totalPrice, modifications }: PricingUpdatesProps) => {
  const recentModifications = modifications.slice(0, 3);
  const totalPriceChange = modifications.reduce((sum, mod) => sum + (mod.priceChange * 4), 0);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Trip Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Price Changes */}
        {recentModifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recent Changes:</h4>
            {recentModifications.map((mod) => (
              <div key={mod.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{mod.description}</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +${mod.priceChange * 4}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        {/* Total Price */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Updated Trip Total
              </p>
              <p className="text-sm text-gray-600">For 4 people</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ${totalPrice.toLocaleString()}
              </p>
              {totalPriceChange > 0 && (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +${totalPriceChange}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          Includes accommodation, activities, meals, and transfers. Final price confirmed upon booking.
        </p>
      </CardContent>
    </Card>
  );
};

export default PricingUpdates;
