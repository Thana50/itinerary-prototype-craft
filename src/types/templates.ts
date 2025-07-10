
export interface TemplateActivity {
  day: number;
  time: string;
  title: string;
  description: string;
  type: 'sightseeing' | 'dining' | 'entertainment' | 'transportation' | 'accommodation' | 'shopping' | 'outdoor' | 'adventure' | 'cultural' | 'relaxation';
  duration: string;
  isCustomizable: boolean;
  alternatives?: string[];
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface TemplateAccommodation {
  name: string;
  type: 'hotel' | 'resort' | 'hostel' | 'apartment' | 'villa';
  location?: string;
  checkIn?: number;
  checkOut?: number;
  roomType?: string;
  priceRange?: { min: number; max: number; currency: string };
  amenities?: string[];
  isCustomizable: boolean;
  alternatives?: string[];
  coordinates?: [number, number];
}

export interface TemplateMeal {
  day: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant?: string;
  cuisine?: string;
  priceRange?: { min: number; max: number; currency: string };
  isHalalAvailable?: boolean;
  isCustomizable: boolean;
  coordinates?: [number, number];
}

export interface TemplateCustomizationPoint {
  id: string;
  day: number;
  title: string;
  description: string;
  options: string[];
  defaultOption: string;
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
  customizationPoints: TemplateCustomizationPoint[];
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
