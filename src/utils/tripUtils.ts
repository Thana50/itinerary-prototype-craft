
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
          "Halal dinner at local restaurant"
        ]
      },
      {
        day: 2,
        title: "Phi Phi Islands Tour",
        activities: [
          "Full day island hopping tour",
          "Snorkeling at Maya Bay",
          "Halal lunch included",
          "Evening free time"
        ]
      },
      {
        day: 3,
        title: "Cultural Phuket",
        activities: [
          "Big Buddha Temple visit",
          "Old Town walking tour",
          "Traditional Thai massage",
          "Halal street food experience"
        ]
      },
      {
        day: 4,
        title: "Adventure Day",
        activities: [
          "Zip lining through jungle",
          "ATV adventure tour",
          "Elephant sanctuary visit",
          "Hotel pool relaxation"
        ]
      }
    ].slice(0, Math.min(days, 7));
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
      }
    ].slice(0, Math.min(days, 7));
  }

  if (destination.includes("Kuala Lumpur, Malaysia")) {
    return [
      {
        day: 1,
        title: "Arrival & City Icons",
        activities: [
          "Airport transfer to hotel",
          "Hotel check-in",
          "Petronas Twin Towers visit",
          "Halal dinner at Bukit Bintang"
        ]
      },
      {
        day: 2,
        title: "Cultural Heritage",
        activities: [
          "Batu Caves temple complex",
          "National Mosque visit",
          "Halal lunch in Little India",
          "Central Market shopping"
        ]
      },
      {
        day: 3,
        title: "Modern Malaysia",
        activities: [
          "KLCC Park and Aquaria",
          "Islamic Arts Museum",
          "Halal street food tour",
          "Menara KL Tower visit"
        ]
      }
    ].slice(0, Math.min(days, 7));
  }

  if (destination.includes("Singapore")) {
    return [
      {
        day: 1,
        title: "Arrival & Marina Bay",
        activities: [
          "Airport transfer to hotel",
          "Hotel check-in",
          "Marina Bay Sands area tour",
          "Halal dinner at Arab Street"
        ]
      },
      {
        day: 2,
        title: "Cultural Singapore",
        activities: [
          "Sultan Mosque visit",
          "Kampong Glam heritage tour",
          "Halal lunch at Malay Heritage Centre",
          "Gardens by the Bay evening show"
        ]
      },
      {
        day: 3,
        title: "Family Fun",
        activities: [
          "Universal Studios Singapore",
          "Sentosa Island beaches",
          "Halal dining at VivoCity",
          "Night Safari adventure"
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
    return "Excellent choice! Thailand is one of our most popular destinations for Middle Eastern families. Thailand offers abundant halal food options, beautiful beaches, Muslim-friendly hotels, and great value for money. The Thai people are very welcoming to visitors from the Middle East.";
  }
  
  if (destination.includes("Malaysia")) {
    return "Perfect choice! Malaysia is ideal for Muslim travelers - it's a majority Muslim country with extensive halal cuisine, beautiful Islamic heritage sites, modern infrastructure, and the Malaysian people share many cultural values with Middle Eastern visitors.";
  }
  
  if (destination.includes("Singapore")) {
    return "Singapore is excellent for families! It's extremely safe and clean, has diverse halal dining options throughout the city, is easy to navigate, and offers world-class attractions. Many Middle Eastern families love Singapore for its efficiency and family-friendly environment.";
  }
  
  if (destination.includes("Indonesia")) {
    return "Great selection! Indonesia offers stunning tropical landscapes and Bali especially has been developing excellent facilities for Middle Eastern visitors, with growing halal tourism infrastructure and beautiful resorts.";
  }
  
  if (destination.includes("Philippines")) {
    return "The Philippines offers beautiful islands and beaches! English is widely spoken, making it easy for international travelers, and there are growing halal dining options in major cities.";
  }
  
  if (destination.includes("Vietnam")) {
    return "Vietnam is an emerging destination with rich culture and history! The country is becoming more welcoming to international tourists with improving halal food options in major cities.";
  }
  
  return "This is an excellent Southeast Asian destination for Middle Eastern travelers!";
};

export const getAIResponse = (input: string, parsedDetails: TripDetails): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Handle activity requests and modifications
  if (lowercaseInput.includes("add") && (lowercaseInput.includes("snorkeling") || lowercaseInput.includes("snorkel"))) {
    if (lowercaseInput.includes("day")) {
      const dayMatch = input.match(/day\s*(\d+)/i);
      const dayNumber = dayMatch ? dayMatch[1] : "your preferred day";
      return `Excellent choice! Snorkeling is fantastic in this region with crystal-clear waters and vibrant marine life. I'll add snorkeling to Day ${dayNumber} of your itinerary. This activity is perfect for all skill levels and typically includes equipment rental.`;
    }
    return "Excellent choice! Snorkeling is fantastic in this region. Which day would you like me to add this activity to your itinerary?";
  }

  // Enhanced destination-specific responses with cultural insights
  if (parsedDetails.destination) {
    let response = "Excellent! I've updated your form with the trip details. ";
    
    if (parsedDetails.itineraryName) {
      response += `Your '${parsedDetails.itineraryName}' trip to ${parsedDetails.destination} looks amazing! `;
    }
    
    response += getDestinationResponse(parsedDetails.destination);
    response += " Would you like me to suggest some specific activities or cultural experiences for your trip?";
    return response;
  }
  
  // Individual destination responses when no full trip details are provided
  const destinations = [
    { keywords: ["thailand", "phuket", "bangkok", "chiang mai"], response: getDestinationResponse("Thailand") + " What specific Thai destinations are you considering?" },
    { keywords: ["malaysia", "kuala lumpur", "kl", "penang", "langkawi"], response: getDestinationResponse("Malaysia") + " Which Malaysian cities interest you most?" },
    { keywords: ["singapore"], response: getDestinationResponse("Singapore") + " What type of Singapore experience would you like to create?" },
    { keywords: ["indonesia", "bali", "jakarta"], response: getDestinationResponse("Indonesia") + " Are you interested in cultural experiences or beach destinations?" },
    { keywords: ["vietnam", "hanoi", "saigon", "ho chi minh"], response: getDestinationResponse("Vietnam") + " Which Vietnamese destinations are you considering?" },
    { keywords: ["philippines", "manila", "boracay", "cebu"], response: getDestinationResponse("Philippines") + " What type of island experience interests you?" }
  ];
  
  for (const dest of destinations) {
    if (dest.keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return dest.response;
    }
  }
  
  if (lowercaseInput.includes("create") || lowercaseInput.includes("itinerary") || lowercaseInput.includes("trip")) {
    return "I'd love to help create an amazing Southeast Asian itinerary! Please tell me: Which country/destination? How many days? How many travelers? I specialize in Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all excellent choices for Middle Eastern travelers!";
  }
  
  return "I'm your Southeast Asian travel specialist! I can help you plan amazing trips to Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all with special consideration for Middle Eastern travelers' needs including halal food, cultural sensitivity, and family-friendly activities. What destination interests you?";
};
