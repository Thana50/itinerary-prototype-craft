
export interface TripDetails {
  itineraryName?: string;
  destination?: string;
  numberOfTravelers?: string;
  duration?: string;
  clientPreferences?: string;
}

export const parseTripDetails = (input: string): TripDetails => {
  const lowercaseInput = input.toLowerCase();
  const details: TripDetails = {};

  // Extract trip name (after "called" or "named")
  const nameMatch = input.match(/(?:called|named)\s+["']?([^"']+?)["']?(?:\s|$|for|to)/i);
  if (nameMatch) {
    details.itineraryName = nameMatch[1].trim();
  }

  // Enhanced destination mapping with fuzzy matching for Southeast Asia
  const destinations = {
    // Thailand
    phuket: "Phuket, Thailand",
    bangkok: "Bangkok, Thailand",
    "chiang mai": "Chiang Mai, Thailand",
    "chiangmai": "Chiang Mai, Thailand",
    "chiang-mai": "Chiang Mai, Thailand",
    krabi: "Krabi, Thailand",
    "koh samui": "Koh Samui, Thailand",
    "ko samui": "Koh Samui, Thailand",
    "samui": "Koh Samui, Thailand",
    pattaya: "Pattaya, Thailand",
    "hua hin": "Hua Hin, Thailand",
    "ayutthaya": "Ayutthaya, Thailand",
    
    // Malaysia
    "kuala lumpur": "Kuala Lumpur, Malaysia",
    "kl": "Kuala Lumpur, Malaysia",
    "kual lumpur": "Kuala Lumpur, Malaysia",
    penang: "Penang, Malaysia",
    "george town": "Penang, Malaysia",
    langkawi: "Langkawi, Malaysia",
    malacca: "Malacca, Malaysia",
    melaka: "Malacca, Malaysia",
    "johor bahru": "Johor Bahru, Malaysia",
    "johor": "Johor Bahru, Malaysia",
    "putrajaya": "Putrajaya, Malaysia",
    
    // Singapore
    singapore: "Singapore",
    "sg": "Singapore",
    "spore": "Singapore",
    
    // Indonesia
    bali: "Bali, Indonesia",
    jakarta: "Jakarta, Indonesia",
    yogyakarta: "Yogyakarta, Indonesia",
    jogja: "Yogyakarta, Indonesia",
    "yogya": "Yogyakarta, Indonesia",
    lombok: "Lombok, Indonesia",
    "ubud": "Bali, Indonesia",
    "denpasar": "Bali, Indonesia",
    "bandung": "Bandung, Indonesia",
    
    // Vietnam
    "ho chi minh": "Ho Chi Minh City, Vietnam",
    "ho chi minh city": "Ho Chi Minh City, Vietnam",
    "saigon": "Ho Chi Minh City, Vietnam",
    "hcmc": "Ho Chi Minh City, Vietnam",
    hanoi: "Hanoi, Vietnam",
    "ha noi": "Hanoi, Vietnam",
    "da nang": "Da Nang, Vietnam",
    "danang": "Da Nang, Vietnam",
    "hoi an": "Hoi An, Vietnam",
    "hoian": "Hoi An, Vietnam",
    "nha trang": "Nha Trang, Vietnam",
    "hue": "Hue, Vietnam",
    
    // Philippines
    manila: "Manila, Philippines",
    boracay: "Boracay, Philippines",
    cebu: "Cebu, Philippines",
    palawan: "Palawan, Philippines",
    "el nido": "El Nido, Philippines",
    "elnido": "El Nido, Philippines",
    "bohol": "Bohol, Philippines",
    "davao": "Davao, Philippines"
  };

  // Find destination with fuzzy matching
  for (const [key, value] of Object.entries(destinations)) {
    if (lowercaseInput.includes(key)) {
      details.destination = value;
      break;
    }
  }

  // Extract number of travelers
  const travelersMatch = input.match(/(\d+)\s*(?:people|travelers?|persons?|pax)/i);
  if (travelersMatch) {
    details.numberOfTravelers = travelersMatch[1];
  }

  // Extract duration
  const durationMatch = input.match(/(\d+)[\s-]*(?:days?|nights?)/i);
  if (durationMatch) {
    details.duration = `${durationMatch[1]} days`;
  }

  return details;
};

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

export const getDestinationResponse = (destination: string): string => {
  if (destination.includes("Thailand")) {
    return "Excellent selection! Based on my experience with similar itineraries, Thailand consistently receives outstanding feedback from our clients. Thailand offers abundant halal food options, beautiful beaches, Muslim-friendly hotels with prayer facilities, and exceptional value for money. Many of my Middle Eastern clients love how welcoming the Thai people are to visitors from the Middle East.";
  }
  
  if (destination.includes("Malaysia")) {
    return "Perfect choice! This is one of our most popular combinations for Muslim travelers. Malaysia is ideal as it's a majority Muslim country with extensive halal cuisine, beautiful Islamic heritage sites, modern infrastructure, and the Malaysian people share many cultural values with Middle Eastern visitors. The hotels provide excellent prayer facilities and the dining is always halal-certified.";
  }
  
  if (destination.includes("Singapore")) {
    return "Singapore is excellent for families! Based on my experience, it's extremely safe and clean, perfect for families with children. It has diverse halal dining options throughout the city, is easy to navigate, and offers world-class attractions. Many Middle Eastern families love Singapore for its efficiency, family-friendly environment, and the fact that prayer facilities are readily available.";
  }
  
  if (destination.includes("Indonesia")) {
    return "Great selection! Indonesia offers stunning tropical landscapes and Bali especially has been developing excellent facilities for Middle Eastern visitors, with growing halal tourism infrastructure and beautiful resorts. The local people are very welcoming to Middle Eastern visitors, and I often recommend it for its natural beauty and cultural experiences.";
  }
  
  if (destination.includes("Philippines")) {
    return "The Philippines offers beautiful islands and beaches! English is widely spoken, making it easy for international travelers, and there are growing halal dining options in major cities. Based on my local contacts, the best experiences are the pristine beaches and warm hospitality of the Filipino people.";
  }
  
  if (destination.includes("Vietnam")) {
    return "Vietnam is an emerging destination with rich culture and history! The country is becoming more welcoming to international tourists with improving halal food options in major cities. I often recommend Vietnam for travelers seeking authentic cultural experiences and beautiful landscapes.";
  }
  
  return "This is an excellent Southeast Asian destination for Middle Eastern travelers!";
};

export const getAIResponse = (input: string, parsedDetails: TripDetails): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Handle activity requests and modifications with professional expertise
  if (lowercaseInput.includes("add") && (lowercaseInput.includes("snorkeling") || lowercaseInput.includes("snorkel"))) {
    if (lowercaseInput.includes("day")) {
      const dayMatch = input.match(/day\s*(\d+)/i);
      const dayNumber = dayMatch ? dayMatch[1] : "your preferred day";
      return `Excellent choice! Based on my experience with similar itineraries, snorkeling is fantastic in this region with crystal-clear waters and vibrant marine life. I'll add snorkeling to Day ${dayNumber} of your itinerary. This activity is perfect for all skill levels and typically includes equipment rental. Many of my Middle Eastern clients love the underwater experiences here!`;
    }
    return "Excellent choice! Snorkeling is fantastic in this region. Which day would you like me to add this activity to your itinerary? A tip from my local contacts: the morning sessions usually offer the best visibility.";
  }

  // Enhanced destination-specific responses with cultural insights and professional expertise
  if (parsedDetails.destination) {
    let response = "Excellent! I've updated your form with the trip details. ";
    
    if (parsedDetails.itineraryName) {
      response += `Your '${parsedDetails.itineraryName}' trip to ${parsedDetails.destination} looks amazing! `;
    }
    
    response += getDestinationResponse(parsedDetails.destination);
    response += " I'm excited to create this amazing journey for you! Would you like me to suggest some specific activities or cultural experiences that I often recommend for this destination?";
    return response;
  }
  
  // Individual destination responses when no full trip details are provided
  const destinations = [
    { keywords: ["thailand", "phuket", "bangkok", "chiang mai"], response: getDestinationResponse("Thailand") + " What specific Thai destinations are you considering? I have several excellent options for you based on your preferences." },
    { keywords: ["malaysia", "kuala lumpur", "kl", "penang", "langkawi"], response: getDestinationResponse("Malaysia") + " Which Malaysian cities interest you most? This destination combines the best of culture, relaxation, and adventure." },
    { keywords: ["singapore"], response: getDestinationResponse("Singapore") + " What type of Singapore experience would you like to create? I can absolutely accommodate any preference you have." },
    { keywords: ["indonesia", "bali", "jakarta"], response: getDestinationResponse("Indonesia") + " Are you interested in cultural experiences or beach destinations? Let me find the perfect solution for that." },
    { keywords: ["vietnam", "hanoi", "saigon", "ho chi minh"], response: getDestinationResponse("Vietnam") + " Which Vietnamese destinations are you considering? This experience is particularly special because of its rich history and emerging tourism infrastructure." },
    { keywords: ["philippines", "manila", "boracay", "cebu"], response: getDestinationResponse("Philippines") + " What type of island experience interests you? If you're interested in beach activities, I could also suggest some wonderful alternatives." }
  ];
  
  for (const dest of destinations) {
    if (dest.keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return dest.response;
    }
  }
  
  if (lowercaseInput.includes("create") || lowercaseInput.includes("itinerary") || lowercaseInput.includes("trip")) {
    return "I'd love to help create an amazing Southeast Asian itinerary! Based on my experience with similar itineraries, please tell me: Which country/destination? How many days? How many travelers? I specialize in Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all excellent choices for Middle Eastern travelers with proper halal facilities and cultural sensitivity!";
  }
  
  return "I'm your Southeast Asian travel specialist! Based on my experience helping hundreds of Middle Eastern families plan successful vacations, I can help you plan amazing trips to Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all with special consideration for halal food, prayer facilities, cultural sensitivity, and family-friendly activities. You're going to love these destinations! What destination interests you?";
};
