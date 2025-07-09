
export interface TemplateActivity {
  day: number;
  time: string;
  title: string;
  description: string;
  type: 'sightseeing' | 'dining' | 'entertainment' | 'transportation' | 'accommodation' | 'shopping' | 'outdoor';
  duration: string;
  isCustomizable: boolean;
  alternatives: string[];
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface TemplateAccommodation {
  name: string;
  type: 'hotel' | 'resort' | 'hostel' | 'apartment' | 'villa';
  location: string;
  priceRange: { min: number; max: number; currency: string };
  amenities: string[];
  isCustomizable: boolean;
  coordinates?: [number, number];
}

export interface TemplateMeal {
  day: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant?: string;
  cuisine?: string;
  priceRange: { min: number; max: number; currency: string };
  isCustomizable: boolean;
  coordinates?: [number, number];
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  destination: string;
  duration: number; // in days
  category: 'family' | 'luxury' | 'adventure' | 'cultural' | 'beach' | 'budget';
  successRate: number; // percentage
  lastUsed: string; // ISO date
  timesUsed: number;
  rating: number; // 1-5
  preview: string;
  tags: string[];
  activities: TemplateActivity[];
  accommodations: TemplateAccommodation[];
  meals: TemplateMeal[];
  customizationPoints: string[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface TemplateFilter {
  destination?: string;
  category?: string;
  duration?: { min: number; max: number };
  budget?: { min: number; max: number };
  tags?: string[];
}

export interface TemplateSearchResult extends ItineraryTemplate {
  relevanceScore: number;
  matchedCriteria: string[];
}
