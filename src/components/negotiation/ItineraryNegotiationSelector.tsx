import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { itineraryItemService, type ItineraryItem } from '@/services/itineraryItemService';
import { marketIntelligenceService, type PricingRecommendation } from '@/services/marketIntelligenceService';
import { vendorMatchingService, type VendorMatch } from '@/services/vendorMatchingService';

interface ItineraryNegotiationSelectorProps {
  itineraryId: string;
  itineraryName: string;
  onItemsSelected: (items: SelectedNegotiationItem[]) => void;
  onCancel: () => void;
}

interface SelectedNegotiationItem extends Omit<ItineraryItem, 'suggested_vendors'> {
  selected: boolean;
  pricing_recommendation?: PricingRecommendation;
  suggested_vendors?: VendorMatch[];
  target_price?: number;
  priority_override?: 'low' | 'medium' | 'high';
}

const ItineraryNegotiationSelector = ({
  itineraryId,
  itineraryName,
  onItemsSelected,
  onCancel
}: ItineraryNegotiationSelectorProps) => {
  const [items, setItems] = useState<SelectedNegotiationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalEstimatedSavings, setTotalEstimatedSavings] = useState(0);

  useEffect(() => {
    loadItineraryItems();
  }, [itineraryId]);

  const loadItineraryItems = async () => {
    try {
      setLoading(true);
      
      // Parse itinerary into negotiable items
      const itineraryItems = await itineraryItemService.parseItineraryIntoItems(itineraryId);
      
      // Get pricing recommendations and vendor suggestions for each item
      const enhancedItems: SelectedNegotiationItem[] = await Promise.all(
        itineraryItems.map(async (item) => {
          const [pricingRec, vendorMatches] = await Promise.all([
            marketIntelligenceService.getPricingRecommendation(
              item.item_type,
              item.location || '',
              item.estimated_price || 0,
              item.participants
            ),
            vendorMatchingService.findMatchingVendors(
              item.item_type,
              item.location || '',
              { 
                participants: item.participants,
                budget: item.estimated_price,
                priority: item.negotiation_priority 
              }
            )
          ]);

          return {
            ...item,
            selected: item.is_negotiable,
            pricing_recommendation: pricingRec,
            suggested_vendors: vendorMatches.slice(0, 3), // Top 3 vendors
            target_price: pricingRec.suggested_target
          };
        })
      );

      setItems(enhancedItems);
      updateSelectionStats(enhancedItems);
    } catch (error) {
      console.error('Failed to load itinerary items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectionStats = (items: SelectedNegotiationItem[]) => {
    const selected = items.filter(item => item.selected);
    setSelectedCount(selected.length);
    
    const totalSavings = selected.reduce((sum, item) => {
      const estimated = item.estimated_price || 0;
      const target = item.target_price || estimated;
      return sum + (estimated - target);
    }, 0);
    
    setTotalEstimatedSavings(totalSavings);
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, selected: checked } : item
    );
    setItems(updatedItems);
    updateSelectionStats(updatedItems);
  };

  const handleTargetPriceChange = (itemId: string, newTarget: number) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, target_price: newTarget } : item
    );
    setItems(updatedItems);
    updateSelectionStats(updatedItems);
  };

  const handlePriorityChange = (itemId: string, priority: 'low' | 'medium' | 'high') => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, priority_override: priority } : item
    );
    setItems(updatedItems);
  };

  const handleProceed = () => {
    const selectedItems = items.filter(item => item.selected);
    onItemsSelected(selectedItems);
  };

  const groupedItems = items.reduce((groups, item) => {
    const day = `Day ${item.day_number}`;
    if (!groups[day]) groups[day] = [];
    groups[day].push(item);
    return groups;
  }, {} as Record<string, SelectedNegotiationItem[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Analyzing itinerary and preparing negotiation recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Items for Rate Negotiation</span>
            <Badge variant="outline">{itineraryName}</Badge>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Checkbox className="rounded" />
              <span>{selectedCount} items selected</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>Est. savings: ${totalEstimatedSavings.toFixed(2)}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="by-day" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="by-day">By Day</TabsTrigger>
          <TabsTrigger value="by-type">By Service Type</TabsTrigger>
          <TabsTrigger value="by-priority">By Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="by-day" className="space-y-4">
          {Object.entries(groupedItems).map(([day, dayItems]) => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggle={handleItemToggle}
                    onTargetPriceChange={handleTargetPriceChange}
                    onPriorityChange={handlePriorityChange}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="by-type">
          {/* Group by service type implementation */}
          <div className="text-center py-8 text-muted-foreground">
            Service type grouping coming soon...
          </div>
        </TabsContent>

        <TabsContent value="by-priority">
          {/* Group by priority implementation */}
          <div className="text-center py-8 text-muted-foreground">
            Priority grouping coming soon...
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Ready to start negotiations?</p>
              <p className="text-sm text-muted-foreground">
                {selectedCount} items selected • Estimated total savings: ${totalEstimatedSavings.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleProceed}
                disabled={selectedCount === 0}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Start Negotiations ({selectedCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ItemCardProps {
  item: SelectedNegotiationItem;
  onToggle: (itemId: string, checked: boolean) => void;
  onTargetPriceChange: (itemId: string, newTarget: number) => void;
  onPriorityChange: (itemId: string, priority: 'low' | 'medium' | 'high') => void;
}

const ItemCard = ({ item, onToggle, onTargetPriceChange, onPriorityChange }: ItemCardProps) => {
  const pricingRec = item.pricing_recommendation;
  const bestVendor = item.suggested_vendors?.[0];

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={item.selected}
            onCheckedChange={(checked) => onToggle(item.id, Boolean(checked))}
            className="mt-1"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{item.service_name}</h4>
              <Badge variant={
                item.item_type === 'accommodation' ? 'default' :
                item.item_type === 'activity' ? 'secondary' :
                'outline'
              }>
                {item.item_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{item.participants} people</span>
              </div>
              {item.duration_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.duration_hours}h</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="text-sm">
            <span className="text-muted-foreground">Current: </span>
            <span className="font-medium">${(item.estimated_price || 0).toFixed(2)}</span>
          </div>
          {pricingRec && (
            <div className="text-sm">
              <span className="text-muted-foreground">Target: </span>
              <span className="font-medium text-green-600">
                ${pricingRec.suggested_target.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {item.selected && pricingRec && (
        <div className="mt-3 p-3 bg-muted/50 rounded-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>AI Recommendation:</span>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {pricingRec.success_probability.toFixed(0)}% success rate
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Market rate: </span>
              <span>${pricingRec.market_rate.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Potential discount: </span>
              <span>{pricingRec.discount_potential.toFixed(0)}%</span>
            </div>
          </div>

          {bestVendor && (
            <div className="text-xs">
              <span className="text-muted-foreground">Recommended vendor: </span>
              <span className="font-medium">{bestVendor.vendor.company_name}</span>
              <span className="text-muted-foreground ml-2">
                ({bestVendor.match_score.toFixed(0)}% match)
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {pricingRec.strategy_notes.slice(0, 2).map((note, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryNegotiationSelector;