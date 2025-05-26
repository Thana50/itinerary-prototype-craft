
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
    krabi: "Krabi, Thailand",
    "koh samui": "Koh Samui, Thailand",
    "ko samui": "Koh Samui, Thailand",
    pattaya: "Pattaya, Thailand",
    
    // Malaysia
    "kuala lumpur": "Kuala Lumpur, Malaysia",
    "kl": "Kuala Lumpur, Malaysia",
    penang: "Penang, Malaysia",
    langkawi: "Langkawi, Malaysia",
    malacca: "Malacca, Malaysia",
    melaka: "Malacca, Malaysia",
    "johor bahru": "Johor Bahru, Malaysia",
    
    // Singapore
    singapore: "Singapore",
    "sg": "Singapore",
    
    // Indonesia
    bali: "Bali, Indonesia",
    jakarta: "Jakarta, Indonesia",
    yogyakarta: "Yogyakarta, Indonesia",
    jogja: "Yogyakarta, Indonesia",
    lombok: "Lombok, Indonesia",
    
    // Vietnam
    "ho chi minh": "Ho Chi Minh City, Vietnam",
    "ho chi minh city": "Ho Chi Minh City, Vietnam",
    "saigon": "Ho Chi Minh City, Vietnam",
    hanoi: "Hanoi, Vietnam",
    "ha noi": "Hanoi, Vietnam",
    "da nang": "Da Nang, Vietnam",
    "hoi an": "Hoi An, Vietnam",
    
    // Philippines
    manila: "Manila, Philippines",
    boracay: "Boracay, Philippines",
    cebu: "Cebu, Philippines",
    palawan: "Palawan, Philippines",
    "el nido": "El Nido, Philippines"
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

export const getAIResponse = (input: string, parsedDetails: TripDetails): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Enhanced destination-specific responses with cultural insights
  if (parsedDetails.destination) {
    let response = "Excellent! I've updated your form with the trip details. ";
    
    if (parsedDetails.itineraryName) {
      response += `Your '${parsedDetails.itineraryName}' trip to ${parsedDetails.destination} looks amazing! `;
    }
    
    // Country-specific cultural responses for Middle Eastern travelers
    if (parsedDetails.destination.includes("Thailand")) {
      response += "Excellent choice! Thailand is one of our most popular destinations for Middle Eastern families. Thailand offers abundant halal food options, beautiful beaches, Muslim-friendly hotels, and great value for money. ";
      
      if (parsedDetails.destination.includes("Phuket")) {
        response += "Phuket specifically has many halal-certified restaurants and resorts that cater to Middle Eastern guests. ";
      } else if (parsedDetails.destination.includes("Bangkok")) {
        response += "Bangkok has an extensive selection of halal restaurants and several mosques for prayers. ";
      }
      
    } else if (parsedDetails.destination.includes("Malaysia")) {
      response += "Perfect choice! Malaysia is ideal for Muslim travelers - it's a majority Muslim country with extensive halal cuisine, beautiful Islamic heritage sites, and modern infrastructure. ";
      
      if (parsedDetails.destination.includes("Kuala Lumpur")) {
        response += "KL offers world-class shopping, the iconic Petronas Towers, and incredible food diversity. ";
      }
      
    } else if (parsedDetails.destination.includes("Singapore")) {
      response += "Singapore is excellent for families! It's extremely safe and clean, has diverse halal dining options, is easy to navigate, and offers world-class attractions. The city is very multicultural and welcoming. ";
      
    } else if (parsedDetails.destination.includes("Indonesia")) {
      response += "Great selection! Indonesia offers stunning tropical landscapes and ";
      
      if (parsedDetails.destination.includes("Bali")) {
        response += "Bali has been developing excellent facilities for Middle Eastern visitors with growing halal tourism infrastructure. ";
      }
      
    } else if (parsedDetails.destination.includes("Vietnam")) {
      response += "Vietnam offers rich history, beautiful landscapes, and increasingly Muslim-friendly accommodations, especially in major cities like Ho Chi Minh City and Hanoi. ";
      
    } else if (parsedDetails.destination.includes("Philippines")) {
      response += "The Philippines offers beautiful tropical islands and growing halal tourism options, especially in Manila and major tourist areas. ";
    }
    
    response += "Would you like me to suggest some specific activities or cultural experiences for your trip?";
    return response;
  }
  
  // Individual destination responses when no full trip details are provided
  if (lowercaseInput.includes("thailand") || lowercaseInput.includes("phuket") || lowercaseInput.includes("bangkok")) {
    return "Excellent choice! Thailand is one of our most popular destinations for Middle Eastern families. Thailand offers abundant halal food options, beautiful beaches, Muslim-friendly hotels, and great value for money. What specific Thai destinations are you considering?";
    
  } else if (lowercaseInput.includes("malaysia") || lowercaseInput.includes("kuala lumpur") || lowercaseInput.includes("kl") || lowercaseInput.includes("penang")) {
    return "Perfect choice! Malaysia is ideal for Muslim travelers - it's a majority Muslim country with extensive halal cuisine, beautiful Islamic heritage sites, and modern infrastructure. Which Malaysian cities interest you most?";
    
  } else if (lowercaseInput.includes("singapore")) {
    return "Singapore is excellent for families! It's extremely safe and clean, has diverse halal dining options, is easy to navigate, and offers world-class attractions. What type of Singapore experience would you like to create?";
    
  } else if (lowercaseInput.includes("indonesia") || lowercaseInput.includes("bali") || lowercaseInput.includes("jakarta")) {
    return "Great selection! Indonesia offers stunning tropical landscapes and Bali has been developing excellent facilities for Middle Eastern visitors with growing halal tourism infrastructure. Are you interested in cultural experiences or beach destinations?";
    
  } else if (lowercaseInput.includes("vietnam") || lowercaseInput.includes("hanoi") || lowercaseInput.includes("saigon")) {
    return "Vietnam offers rich history, beautiful landscapes, and increasingly Muslim-friendly accommodations, especially in major cities. Which Vietnamese destinations are you considering?";
    
  } else if (lowercaseInput.includes("philippines") || lowercaseInput.includes("manila") || lowercaseInput.includes("boracay")) {
    return "The Philippines offers beautiful tropical islands and growing halal tourism options, especially in Manila and major tourist areas. What type of island experience interests you?";
    
  } else if (lowercaseInput.includes("create") || lowercaseInput.includes("itinerary") || lowercaseInput.includes("trip")) {
    return "I'd love to help create an amazing Southeast Asian itinerary! Please tell me: Which country/destination? How many days? How many travelers? I specialize in Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all excellent choices for Middle Eastern travelers!";
    
  } else {
    return "I'm your Southeast Asian travel specialist! I can help you plan amazing trips to Thailand, Malaysia, Singapore, Indonesia, Vietnam, and the Philippines - all with special consideration for Middle Eastern travelers' needs including halal food, cultural sensitivity, and family-friendly activities. What destination interests you?";
  }
};
