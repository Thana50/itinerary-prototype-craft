
export interface ItineraryTemplate {
  id: string;
  name: string;
  destination: string;
  duration: number; // in days
  category: 'beach' | 'cultural' | 'adventure' | 'family' | 'luxury' | 'budget';
  successRate: number; // percentage
  lastUsed: string; // ISO date string
  timesUsed: number;
  rating: number; // 1-5 stars
  preview: string;
  tags: string[];
  activities: TemplateActivity[];
  accommodations: TemplateAccommodation[];
  meals: TemplateMeal[];
  customizationPoints: CustomizationPoint[];
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface TemplateActivity {
  day: number;
  time: string;
  title: string;
  description: string;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'shopping' | 'dining';
  duration: string;
  isCustomizable: boolean;
  alternatives?: string[];
}

export interface TemplateAccommodation {
  name: string;
  type: 'hotel' | 'resort' | 'villa' | 'apartment';
  checkIn: number; // day number
  checkOut: number; // day number
  roomType: string;
  isCustomizable: boolean;
  alternatives?: string[];
}

export interface TemplateMeal {
  day: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  isHalalAvailable: boolean;
  isCustomizable: boolean;
}

export interface CustomizationPoint {
  id: string;
  day: number;
  title: string;
  description: string;
  options: string[];
  defaultOption: string;
}
