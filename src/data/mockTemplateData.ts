
import { ItineraryTemplate } from '@/types/templates';

// Mock template data - in production this would come from your backend
export const mockTemplates: ItineraryTemplate[] = [
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
        isCustomizable: false,
        alternatives: [],
        coordinates: [98.2964, 7.8964]
      },
      {
        day: 2,
        time: '08:00',
        title: 'Phi Phi Islands Full Day Tour',
        description: 'Speedboat tour with Maya Bay, snorkeling, and lunch',
        type: 'adventure',
        duration: '8 hours',
        isCustomizable: true,
        alternatives: ['James Bond Island Tour', 'Coral Island Tour'],
        coordinates: [98.7784, 7.7407]
      },
      {
        day: 3,
        time: '09:00',
        title: 'Big Buddha & Wat Chalong',
        description: 'Visit iconic landmarks and learn about Thai Buddhism',
        type: 'cultural',
        duration: '4 hours',
        isCustomizable: true,
        alternatives: ['Old Town Walking Tour', 'Thai Cooking Class'],
        coordinates: [98.3091, 7.8415]
      },
      {
        day: 3,
        time: '15:00',
        title: 'Karon Viewpoint & Beach Time',
        description: 'Panoramic views and relaxation at Karon Beach',
        type: 'relaxation',
        duration: '3 hours',
        isCustomizable: false,
        alternatives: [],
        coordinates: [98.2892, 7.8380]
      },
      {
        day: 4,
        time: '10:00',
        title: 'Old Phuket Town Tour',
        description: 'Explore colonial architecture, street art, and local markets',
        type: 'cultural',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Phuket Elephant Sanctuary', 'ATV Adventure'],
        coordinates: [98.3879, 7.8804]
      },
      {
        day: 4,
        time: '19:00',
        title: 'Phuket FantaSea Show',
        description: 'Cultural theme park with theatrical performance',
        type: 'entertainment',
        duration: '4 hours',
        isCustomizable: true,
        alternatives: ['Simon Cabaret Show', 'Patong Night Market'],
        coordinates: [98.3358, 8.0333]
      },
      {
        day: 5,
        time: '08:30',
        title: 'James Bond Island Tour',
        description: 'Canoe through limestone caves and visit Khao Phing Kan',
        type: 'adventure',
        duration: '7 hours',
        isCustomizable: true,
        alternatives: ['Coral Island Watersports', 'Similan Islands Diving'],
        coordinates: [98.5004, 8.2756]
      },
      {
        day: 6,
        time: '09:00',
        title: 'Spa & Wellness Day',
        description: 'Traditional Thai massage and spa treatments',
        type: 'relaxation',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Beach Yoga Session', 'Muay Thai Class'],
        coordinates: [98.2964, 7.8964]
      },
      {
        day: 6,
        time: '17:00',
        title: 'Sunset Dinner Cruise',
        description: 'Romantic cruise with dinner and entertainment',
        type: 'dining',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Beachfront Seafood Dinner', 'Rooftop Restaurant'],
        coordinates: [98.3300, 7.9519]
      },
      {
        day: 7,
        time: '10:00',
        title: 'Last-Minute Shopping & Departure',
        description: 'Souvenir shopping at Central Festival mall and airport transfer',
        type: 'shopping',
        duration: '3 hours',
        isCustomizable: false,
        alternatives: [],
        coordinates: [98.3388, 7.8905]
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
        isCustomizable: false,
        alternatives: [],
        coordinates: [103.8593, 1.2816]
      },
      {
        day: 2,
        time: '09:00',
        title: 'Universal Studios Singapore',
        description: 'Full day at Southeast Asia\'s only Universal Studios theme park',
        type: 'entertainment',
        duration: '8 hours',
        isCustomizable: true,
        alternatives: ['Adventure Cove Waterpark', 'S.E.A. Aquarium'],
        coordinates: [103.8238, 1.2540]
      },
      {
        day: 3,
        time: '10:00',
        title: 'Singapore Zoo Morning Safari',
        description: 'World-renowned open-concept zoo with breakfast experience',
        type: 'entertainment',
        duration: '4 hours',
        isCustomizable: true,
        alternatives: ['Bird Paradise', 'River Wonders'],
        coordinates: [103.7893, 1.4043]
      },
      {
        day: 3,
        time: '15:00',
        title: 'Little India & Arab Street',
        description: 'Cultural neighborhoods with shopping and authentic cuisine',
        type: 'cultural',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Chinatown Heritage Centre', 'Kampong Glam Tour'],
        coordinates: [103.8548, 1.3021]
      },
      {
        day: 4,
        time: '09:30',
        title: 'Sentosa Island Adventure',
        description: 'Cable car ride, beaches, and island attractions',
        type: 'adventure',
        duration: '6 hours',
        isCustomizable: true,
        alternatives: ['Jurong Bird Park', 'Science Centre Singapore'],
        coordinates: [103.8198, 1.2494]
      },
      {
        day: 4,
        time: '19:00',
        title: 'Clarke Quay River Cruise & Dinner',
        description: 'Evening cruise along Singapore River with riverside dining',
        type: 'dining',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Hawker Centre Food Tour', 'Halal Fine Dining'],
        coordinates: [103.8467, 1.2897]
      },
      {
        day: 5,
        time: '10:00',
        title: 'Orchard Road Shopping',
        description: 'Premier shopping district with malls and boutiques',
        type: 'shopping',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['VivoCity Mall', 'Bugis Street Market'],
        coordinates: [103.8320, 1.3048]
      },
      {
        day: 5,
        time: '15:00',
        title: 'Merlion Park & Departure Prep',
        description: 'Final photo ops at Singapore\'s iconic landmark and check-out',
        type: 'sightseeing',
        duration: '2 hours',
        isCustomizable: false,
        alternatives: [],
        coordinates: [103.8545, 1.2868]
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
        isCustomizable: false,
        alternatives: [],
        coordinates: [115.2624, -8.4337]
      },
      {
        day: 2,
        time: '08:00',
        title: 'Tirta Empul Temple & Purification',
        description: 'Sacred water temple with traditional cleansing ritual',
        type: 'cultural',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Besakih Temple Tour', 'Goa Gajah Cave'],
        coordinates: [115.3152, -8.4154]
      },
      {
        day: 2,
        time: '14:00',
        title: 'Ubud Art Villages Tour',
        description: 'Visit Celuk (silver), Batuan (painting), and Mas (wood carving)',
        type: 'cultural',
        duration: '4 hours',
        isCustomizable: true,
        alternatives: ['Ubud Art Market', 'Agung Rai Museum'],
        coordinates: [115.2809, -8.5833]
      },
      {
        day: 3,
        time: '09:00',
        title: 'Silver Jewelry Making Workshop',
        description: 'Hands-on experience creating traditional Balinese jewelry',
        type: 'cultural',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Batik Painting Class', 'Wood Carving Demo'],
        coordinates: [115.2809, -8.5833]
      },
      {
        day: 3,
        time: '15:00',
        title: 'Monkey Forest Sanctuary',
        description: 'Walk through sacred forest with hundreds of playful monkeys',
        type: 'outdoor',
        duration: '2 hours',
        isCustomizable: false,
        alternatives: [],
        coordinates: [115.2602, -8.5186]
      },
      {
        day: 4,
        time: '05:00',
        title: 'Mount Batur Sunrise Trek',
        description: 'Pre-dawn hike to volcanic summit for spectacular sunrise',
        type: 'adventure',
        duration: '6 hours',
        isCustomizable: true,
        alternatives: ['Bali Swing Experience', 'White Water Rafting'],
        coordinates: [115.3753, -8.2423]
      },
      {
        day: 4,
        time: '15:00',
        title: 'Coffee Plantation Tour',
        description: 'Learn about Bali coffee and taste the famous Luwak coffee',
        type: 'cultural',
        duration: '2 hours',
        isCustomizable: true,
        alternatives: ['Herbal Medicine Garden', 'Spice Farm Tour'],
        coordinates: [115.3100, -8.4200]
      },
      {
        day: 5,
        time: '09:00',
        title: 'Tanah Lot Temple',
        description: 'Iconic sea temple perched on a rock formation',
        type: 'cultural',
        duration: '3 hours',
        isCustomizable: true,
        alternatives: ['Uluwatu Temple', 'Taman Ayun Temple'],
        coordinates: [115.0868, -8.6211]
      },
      {
        day: 5,
        time: '14:00',
        title: 'Traditional Balinese Massage',
        description: 'Authentic spa treatment with local healing techniques',
        type: 'relaxation',
        duration: '2 hours',
        isCustomizable: true,
        alternatives: ['Yoga & Meditation Session', 'Hot Stone Therapy'],
        coordinates: [115.2624, -8.4337]
      },
      {
        day: 5,
        time: '19:00',
        title: 'Kecak Fire Dance Performance',
        description: 'Mesmerizing traditional dance at sunset',
        type: 'entertainment',
        duration: '2 hours',
        isCustomizable: true,
        alternatives: ['Legong Dance Show', 'Barong Dance'],
        coordinates: [115.0864, -8.8290]
      },
      {
        day: 6,
        time: '10:00',
        title: 'Ubud Central Market Shopping',
        description: 'Browse handicrafts, textiles, and souvenirs',
        type: 'shopping',
        duration: '2 hours',
        isCustomizable: true,
        alternatives: ['Sukawati Art Market', 'Seminyak Boutiques'],
        coordinates: [115.2602, -8.5066]
      },
      {
        day: 6,
        time: '14:00',
        title: 'Departure & Blessing Ceremony',
        description: 'Traditional farewell blessing and airport transfer',
        type: 'cultural',
        duration: '2 hours',
        isCustomizable: false,
        alternatives: [],
        coordinates: [115.1671, -8.7486]
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
