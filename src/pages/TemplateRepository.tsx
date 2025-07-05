
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { templateService } from "@/services/templateService";
import { ItineraryTemplate } from "@/types/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateCreationWizard from "@/components/templates/TemplateCreationWizard";
import TemplatePerformanceView from "@/components/templates/TemplatePerformanceView";

const TemplateRepository = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ItineraryTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ItineraryTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ItineraryTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'browse' | 'performance' | 'edit'>('browse');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory, selectedDuration, selectedBudget]);

  const loadTemplates = async () => {
    try {
      const templateList = await templateService.getPopularTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (selectedDuration !== 'all') {
      const duration = parseInt(selectedDuration);
      filtered = filtered.filter(template => {
        if (selectedDuration === '1-3') return template.duration >= 1 && template.duration <= 3;
        if (selectedDuration === '4-7') return template.duration >= 4 && template.duration <= 7;
        if (selectedDuration === '8-14') return template.duration >= 8 && template.duration <= 14;
        if (selectedDuration === '15+') return template.duration >= 15;
        return true;
      });
    }

    if (selectedBudget !== 'all') {
      filtered = filtered.filter(template => {
        const maxCost = template.estimatedCost.max;
        if (selectedBudget === 'budget') return maxCost <= 2000;
        if (selectedBudget === 'mid') return maxCost > 2000 && maxCost <= 5000;
        if (selectedBudget === 'luxury') return maxCost > 5000;
        return true;
      });
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateView = (template: ItineraryTemplate) => {
    setSelectedTemplate(template);
    setViewMode('performance');
  };

  const handleTemplateEdit = (template: ItineraryTemplate) => {
    setSelectedTemplate(template);
    setViewMode('edit');
  };

  const handleTemplateUse = (template: ItineraryTemplate) => {
    // Navigate to create itinerary with template pre-loaded
    navigate('/create-itinerary', { state: { template } });
  };

  if (viewMode === 'performance' && selectedTemplate) {
    return (
      <TemplatePerformanceView
        template={selectedTemplate}
        onBack={() => setViewMode('browse')}
        onEdit={() => setViewMode('edit')}
        onUse={() => handleTemplateUse(selectedTemplate)}
      />
    );
  }

  if (viewMode === 'edit' && selectedTemplate) {
    return (
      <TemplateCreationWizard
        template={selectedTemplate}
        onClose={() => setViewMode('browse')}
        onSave={(updatedTemplate) => {
          // Update template in list
          setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
          setViewMode('browse');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/agent-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Repository</h1>
              <p className="text-gray-600">Manage and browse your itinerary templates</p>
            </div>
          </div>
          <Button onClick={() => setShowCreationWizard(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates by name, destination, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Duration</SelectItem>
                  <SelectItem value="1-3">1-3 Days</SelectItem>
                  <SelectItem value="4-7">4-7 Days</SelectItem>
                  <SelectItem value="8-14">8-14 Days</SelectItem>
                  <SelectItem value="15+">15+ Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="budget">Budget ($0-2K)</SelectItem>
                  <SelectItem value="mid">Mid-Range ($2K-5K)</SelectItem>
                  <SelectItem value="luxury">Luxury ($5K+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredTemplates.length} of {templates.length} templates
            </span>
            <span>
              {searchQuery && `Search results for "${searchQuery}"`}
            </span>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={() => handleTemplateView(template)}
              onEdit={() => handleTemplateEdit(template)}
              onUse={() => handleTemplateUse(template)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or create a new template.
            </p>
            <Button onClick={() => setShowCreationWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </div>
        )}
      </div>

      {/* Template Creation Wizard Modal */}
      {showCreationWizard && (
        <TemplateCreationWizard
          onClose={() => setShowCreationWizard(false)}
          onSave={(newTemplate) => {
            setTemplates(prev => [...prev, newTemplate]);
            setShowCreationWizard(false);
          }}
        />
      )}
    </div>
  );
};

export default TemplateRepository;
