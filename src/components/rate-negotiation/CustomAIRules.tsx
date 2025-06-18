
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, Users, MapPin, Plus, Trash2 } from "lucide-react";

const CustomAIRules = () => {
  const [newRule, setNewRule] = useState({ type: "", name: "", rule: "" });

  const providerRules = [
    {
      provider: "Phuket Beach Resort",
      rules: [
        "Always mention volume business in first message",
        "Counter-offers typically accepted at 8% below offered rate",
        "Include breakfast request in all negotiations"
      ]
    },
    {
      provider: "Phi Phi Island Tours",
      rules: [
        "Emphasize safety standards for Middle Eastern clientele",
        "Best response times: Tuesday-Thursday mornings",
        "Package deals perform 25% better than individual bookings"
      ]
    }
  ];

  const clientRules = [
    {
      clientType: "UAE Clients",
      rules: [
        "Always prioritize halal dining confirmation",
        "Prayer facility availability is non-negotiable",
        "Family room configurations preferred"
      ]
    },
    {
      clientType: "Corporate Groups",
      rules: [
        "Emphasize professional service standards",
        "Meeting room availability important",
        "Flexible check-in/out times valued highly"
      ]
    }
  ];

  const marketRules = [
    {
      season: "Shoulder Season (March-May)",
      rules: [
        "Expect 20-30% savings from peak rates",
        "Properties have higher flexibility",
        "Group bookings get additional 5% leverage"
      ]
    },
    {
      season: "Peak Season (December-February)",
      rules: [
        "Accept smaller discounts (5-10%)",
        "Focus on value-adds over rate reductions",
        "Book early to secure availability"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-blue-600 mr-2" />
              <CardTitle>Provider-Specific Rules</CardTitle>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Provider Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providerRules.map((provider, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">{provider.provider}</h4>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {provider.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-blue-800">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>Client-Specific Rules</CardTitle>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Client Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientRules.map((client, index) => (
              <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-900">{client.clientType}</h4>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {client.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-green-800">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle>Market Rules</CardTitle>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Market Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketRules.map((market, index) => (
              <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-purple-900">{market.season}</h4>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {market.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-purple-800">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Custom Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule-type">Rule Type</Label>
              <select 
                id="rule-type"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRule.type}
                onChange={(e) => setNewRule({...newRule, type: e.target.value})}
              >
                <option value="">Select type</option>
                <option value="provider">Provider-Specific</option>
                <option value="client">Client-Specific</option>
                <option value="market">Market-Specific</option>
              </select>
            </div>
            <div>
              <Label htmlFor="rule-name">Name/Category</Label>
              <Input
                id="rule-name"
                placeholder="e.g., 'Dubai Luxury Hotels'"
                value={newRule.name}
                onChange={(e) => setNewRule({...newRule, name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rule-description">Rule Description</Label>
            <Textarea
              id="rule-description"
              placeholder="Describe the specific behavior or condition for this rule..."
              value={newRule.rule}
              onChange={(e) => setNewRule({...newRule, rule: e.target.value})}
              rows={3}
            />
          </div>
          <Button 
            className="w-full"
            disabled={!newRule.type || !newRule.name || !newRule.rule}
          >
            Add Custom Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomAIRules;
