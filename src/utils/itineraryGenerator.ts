
export const generateSampleItinerary = (destination: string, duration: string): any[] => {
  const days = parseInt(duration.replace(/\D/g, '')) || 7;
  
  if (destination.includes("Phuket, Thailand")) {
    return [
      {
        day: 1,
        title: "Arrival & Patong Beach",
        activities: [
          "Airport transfer to hotel",
          "Hotel check-in and welcome drink",
          "Patong Beach sunset walk",
          "Halal dinner at local Thai restaurant"
        ]
      },
      {
        day: 2,
        title: "Phi Phi Islands Tour",
        activities: [
          "Full day island hopping tour",
          "Snorkeling at Maya Bay",
          "Halal lunch included on boat",
          "Return to hotel, evening free"
        ]
      },
      {
        day: 3,
        title: "Cultural Phuket Experience",
        activities: [
          "Visit Big Buddha Temple",
          "Old Town Phuket walking tour",
          "Traditional Thai massage",
          "Halal street food experience"
        ]
      },
      {
        day: 4,
        title: "Adventure Activities",
        activities: [
          "Zip lining through jungle",
          "ATV adventure tour",
          "Elephant sanctuary visit",
          "Free time at hotel pool"
        ]
      },
      {
        day: 5,
        title: "Beach & Relaxation",
        activities: [
          "Private beach day",
          "Water sports (optional)",
          "Spa treatment",
          "Sunset dinner cruise"
        ]
      },
      {
        day: 6,
        title: "Shopping & Culture",
        activities: [
          "Weekend market visit",
          "Souvenir shopping",
          "Cooking class experience",
          "Farewell dinner"
        ]
      },
      {
        day: 7,
        title: "Departure",
        activities: [
          "Hotel check-out",
          "Last-minute shopping",
          "Airport transfer"
        ]
      }
    ].slice(0, Math.min(days, 7));
  }

  if (destination.includes("Singapore")) {
    return [
      {
        day: 1,
        title: "City Arrival",
        activities: [
          "Changi Airport arrival",
          "Marina Bay Sands area",
          "Halal food court dinner"
        ]
      },
      {
        day: 2,
        title: "Cultural Singapore",
        activities: [
          "Arab Quarter exploration",
          "Sultan Mosque visit",
          "Halal food trail tour"
        ]
      },
      {
        day: 3,
        title: "Modern Attractions",
        activities: [
          "Gardens by the Bay",
          "Singapore Flyer",
          "Universal Studios"
        ]
      },
      {
        day: 4,
        title: "Island & Nature",
        activities: [
          "Sentosa Island",
          "Beach activities",
          "Cable car ride"
        ]
      },
      {
        day: 5,
        title: "Shopping & Departure",
        activities: [
          "Orchard Road shopping",
          "Airport transfer"
        ]
      }
    ].slice(0, Math.min(days, 5));
  }

  if (destination.includes("Kuala Lumpur, Malaysia")) {
    return [
      {
        day: 1,
        title: "City Arrival",
        activities: [
          "KLIA arrival",
          "Petronas Towers visit",
          "Halal dinner in KLCC"
        ]
      },
      {
        day: 2,
        title: "Islamic Heritage",
        activities: [
          "National Mosque visit",
          "Islamic Arts Museum",
          "Central Market exploration"
        ]
      },
      {
        day: 3,
        title: "Cultural Mix",
        activities: [
          "Batu Caves temple",
          "Little India tour",
          "Chinatown visit"
        ]
      },
      {
        day: 4,
        title: "Modern KL",
        activities: [
          "KL Tower observation",
          "Shopping at Pavilion",
          "Food court experience"
        ]
      },
      {
        day: 5,
        title: "Day Trip",
        activities: [
          "Malacca historical city",
          "UNESCO sites",
          "Traditional crafts"
        ]
      },
      {
        day: 6,
        title: "Departure",
        activities: [
          "Last-minute shopping",
          "Airport transfer"
        ]
      }
    ].slice(0, Math.min(days, 6));
  }

  if (destination.includes("Bangkok, Thailand")) {
    return [
      {
        day: 1,
        title: "Arrival & City Center",
        activities: [
          "Airport transfer to hotel",
          "Hotel check-in",
          "Chatuchak Weekend Market visit",
          "Halal dinner in Chinatown"
        ]
      },
      {
        day: 2,
        title: "Cultural Bangkok",
        activities: [
          "Grand Palace and Wat Phra Kaew",
          "Wat Pho Temple tour",
          "Halal lunch at local restaurant",
          "Chao Phraya River cruise"
        ]
      },
      {
        day: 3,
        title: "Modern Bangkok",
        activities: [
          "MBK Shopping Center",
          "Jim Thompson House",
          "Halal Thai cooking class",
          "Rooftop dinner with city views"
        ]
      },
      {
        day: 4,
        title: "Cultural & Shopping",
        activities: [
          "Floating market tour",
          "Traditional massage experience",
          "Siam Square shopping",
          "Cultural show dinner"
        ]
      }
    ].slice(0, Math.min(days, 7));
  }

  if (destination.includes("Bali, Indonesia")) {
    return [
      {
        day: 1,
        title: "Arrival & Ubud",
        activities: [
          "Airport transfer to Ubud",
          "Hotel check-in",
          "Rice terrace walk",
          "Halal dinner with cultural show"
        ]
      },
      {
        day: 2,
        title: "Cultural Exploration",
        activities: [
          "Temple visits (Tanah Lot)",
          "Traditional art villages",
          "Halal Indonesian cooking class",
          "Spa treatment"
        ]
      },
      {
        day: 3,
        title: "Beach & Relaxation",
        activities: [
          "Transfer to beach resort",
          "Beach activities",
          "Water sports (optional)",
          "Sunset dinner"
        ]
      }
    ].slice(0, Math.min(days, 7));
  }

  // Default itinerary for other destinations
  return [
    {
      day: 1,
      title: "Arrival & Orientation",
      activities: [
        "Airport transfer to hotel",
        "Hotel check-in and orientation",
        "Local area exploration",
        "Welcome halal dinner"
      ]
    },
    {
      day: 2,
      title: "Cultural Discovery",
      activities: [
        "Cultural sites and landmarks",
        "Local market visit",
        "Halal lunch experience",
        "Traditional activities"
      ]
    },
    {
      day: 3,
      title: "Adventure & Relaxation",
      activities: [
        "Adventure activities",
        "Scenic tour",
        "Halal dining experience",
        "Leisure time"
      ]
    }
  ].slice(0, Math.min(days, 7));
};
