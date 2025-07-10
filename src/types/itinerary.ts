
export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  date?: string;
  location?: string;
  accommodation?: string;
}

export interface ItineraryData {
  id: string;
  title: string;
  destination: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'review' | 'approved' | 'confirmed' | 'shared' | 'modified';
  client?: string;
  travelers: number;
  totalPrice?: number;
  days: ItineraryDay[];
  preferences?: string;
  modificationRequests?: number;
  negotiations?: number;
}

export interface ItineraryDisplayProps {
  itinerary: ItineraryData;
  showActions?: boolean;
  userRole?: 'agent' | 'traveler';
  onApprove?: () => void;
  onModify?: () => void;
  onShare?: () => void;
}
