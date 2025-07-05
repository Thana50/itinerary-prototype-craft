
import { ItineraryTemplate } from '@/types/templates';

// Mock template data - in production this would come from your backend
const mockTemplates: ItineraryTemplate[] = [
  {
    id: 'phuket-beach-7d',
    name: 'Phuket Beach Paradise',
    destination: 'Phuket, Thailand',
    duration: 7,
    category: 'beach',
    successRate: 94,
    lastUsed: '2025-01-15T10:30:00Z',
    timesUsed: 23,
    rating: 4.8,
    preview: 'Perfect blend of beach relaxation and cultural exploration with halal dining options',
    tags: ['beach', 'cultural', 'halal-friendly', 'family'],
    activities: [
      {
        day: 1,
        time: '14:00',
        title: 'Arrival & Patong Beach Sunset',
        description: 'Airport transfer, hotel check-in, evening beach walk',
        type: 'relaxation',
        duration: '4 hours',
        isCustomizable: false
      },
      {
        day: 2,
        time: '08:00',
        title: 'Phi Phi Islands Full Day Tour',
        description: 'Speedboat tour with Maya Bay, snorkeling, and lunch',
        type: 'adventure',
        duration: '8 hours',
        isCustomizable: true,
        alternatives: ['James Bond Island Tour', 'Coral Island Tour']
      }
    ],
    accommodations: [
      {
        name: 'Phuket Beach Resort & Spa',
        type: 'resort',
        checkIn: 1,
        checkOut: 7,
        roomType: 'Superior Ocean View',
        isCustomizable: true,
        alternatives: ['Patong Beach Hotel', 'Kata Beach Resort']
      }
    ],
    meals: [
      {
        day: 1,
        type: 'dinner',
        restaurant: 'Halal Thai Restaurant',
        cuisine: 'Thai',
        isHalalAvailable: true,
        isCustomizable: true
      }
    ],
    customizationPoints: [
      {
        id: 'cp1',
        day: 3,
        title: 'Cultural Experience',
        description: 'Choose your preferred cultural activity',
        options: ['Big Buddha Temple', 'Old Town Walking Tour', 'Thai Cooking Class'],
        defaultOption: 'Big Buddha Temple'
      }
    ],
    estimatedCost: {
      min: 2800,
      max: 3500,
      currency: 'USD'
    }
  },
  {
    id: 'singapore-family-5d',
    name: 'Singapore Family Adventure',
    destination: 'Singapore',
    duration: 5,
    category: 'family',
    successRate: 91,
    lastUsed: '2025-01-10T15:20:00Z',
    timesUsed: 18,
    rating: 4.6,
    preview: 'Family-friendly Singapore highlights with cultural attractions and modern wonders',
    tags: ['family', 'cultural', 'modern', 'halal-friendly'],
    activities: [
      {
        day: 1,
        time: '16:00',
        title: 'Marina Bay Exploration',
        description: 'Gardens by the Bay and Marina Bay Sands area',
        type: 'sightseeing',
        duration: '3 hours',
        isCustomizable: false
      }
    ],
    accommodations: [
      {
        name: 'Marina Bay Family Hotel',
        type: 'hotel',
        checkIn: 1,
        checkOut: 5,
        roomType: 'Family Suite',
        isCustomizable: true,
        alternatives: ['Sentosa Resort', 'Clarke Quay Hotel']
      }
    ],
    meals: [
      {
        day: 1,
        type: 'dinner',
        restaurant: 'Arab Street Halal Restaurant',
        cuisine: 'Middle Eastern',
        isHalalAvailable: true,
        isCustomizable: true
      }
    ],
    customizationPoints: [
      {
        id: 'cp2',
        day: 2,
        title: 'Theme Park Choice',
        description: 'Select your preferred theme park',
        options: ['Universal Studios', 'Adventure Cove Waterpark', 'S.E.A. Aquarium'],
        defaultOption: 'Universal Studios'
      }
    ],
    estimatedCost: {
      min: 3200,
      max: 4000,
      currency: 'USD'
    }
  },
  {
    id: 'bali-cultural-6d',
    name: 'Bali Cultural Immersion',
    destination: 'Bali, Indonesia',
    duration: 6,
    category: 'cultural',
    successRate: 89,
    lastUsed: '2024-12-28T09:15:00Z',
    timesUsed: 15,
    rating: 4.7,
    preview: 'Authentic Balinese culture with temple visits, art villages, and traditional experiences',
    tags: ['cultural', 'traditional', 'art', 'spiritual'],
    activities: [
      {
        day: 1,
        time: '15:00',
        title: 'Ubud Rice Terraces',
        description: 'Scenic walk through traditional rice paddies',
        type: 'cultural',
        duration: '2 hours',
        isCustomizable: false
      }
    ],
    accommodations: [
      {
        name: 'Ubud Cultural Resort',
        type: 'resort',
        checkIn: 1,
        checkOut: 6,
        roomType: 'Traditional Villa',
        isCustomizable: true,
        alternatives: ['Sanur Beach Hotel', 'Seminyak Resort']
      }
    ],
    meals: [
      {
        day: 1,
        type: 'dinner',
        restaurant: 'Traditional Indonesian Restaurant',
        cuisine: 'Indonesian',
        isHalalAvailable: true,
        isCustomizable: true
      }
    ],
    customizationPoints: [
      {
        id: 'cp3',
        day: 3,
        title: 'Art Experience',
        description: 'Choose your artistic adventure',
        options: ['Silver Jewelry Workshop', 'Batik Painting Class', 'Wood Carving Demo'],
        defaultOption: 'Silver Jewelry Workshop'
      }
    ],
    estimatedCost: {
      min: 2200,
      max: 2800,
      currency: 'USD'
    }
  }
];

export const templateService = {
  async searchTemplates(query: string): Promise<ItineraryTemplate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      return mockTemplates;
    }
    
    const searchTerm = query.toLowerCase();
    return mockTemplates.filter(template => 
      template.destination.toLowerCase().includes(searchTerm) ||
      template.name.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  async getTemplate(id: string): Promise<ItineraryTemplate | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates.find(template => template.id === id) || null;
  },

  async getPopularTemplates(): Promise<ItineraryTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates
      .sort((a, b) => b.timesUsed - a.timesUsed)
      .slice(0, 6);
  },

  async getRecentTemplates(): Promise<ItineraryTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, 4);
  }
};
