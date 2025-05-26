
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

  // Enhanced destination mapping with full names
  const destinations = {
    phuket: "Phuket, Thailand",
    bangkok: "Bangkok, Thailand",
    "chiang mai": "Chiang Mai, Thailand",
    krabi: "Krabi, Thailand",
    singapore: "Singapore",
    "kuala lumpur": "Kuala Lumpur, Malaysia",
    penang: "Penang, Malaysia",
    langkawi: "Langkawi, Malaysia",
    malacca: "Malacca, Malaysia",
    bali: "Bali, Indonesia",
    jakarta: "Jakarta, Indonesia",
    yogyakarta: "Yogyakarta, Indonesia",
    "ho chi minh": "Ho Chi Minh City, Vietnam",
    hanoi: "Hanoi, Vietnam",
    "da nang": "Da Nang, Vietnam",
    manila: "Manila, Philippines",
    boracay: "Boracay, Philippines",
    cebu: "Cebu, Philippines"
  };

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
  
  // Special response for the example case
  if (lowercaseInput.includes("phuket") && lowercaseInput.includes("paradise beach") && lowercaseInput.includes("4 people") && lowercaseInput.includes("7")) {
    return "Perfect! I've created 'Paradise Beach' - your Phuket adventure! Thailand is excellent for Middle Eastern families with abundant halal food options, beautiful beaches, and rich culture.";
  }
  
  // Enhanced destination-specific responses
  if (parsedDetails.destination) {
    let response = "Great! I've extracted the trip details and updated your form. ";
    
    if (parsedDetails.itineraryName) {
      response += `Your '${parsedDetails.itineraryName}' trip to ${parsedDetails.destination} looks amazing! `;
    } else {
      response += `${parsedDetails.destination} is an excellent choice! `;
    }
    
    // Country-specific cultural responses
    if (parsedDetails.destination.includes("Thailand")) {
      response += "Thailand is excellent for Middle Eastern families - abundant halal food, beautiful beaches, Muslim-friendly hotels. ";
    } else if (parsedDetails.destination.includes("Malaysia")) {
      response += "Malaysia is perfect for Muslim travelers - majority Muslim country, extensive halal cuisine, Islamic heritage sites. ";
    } else if (parsedDetails.destination.includes("Singapore")) {
      response += "Singapore is ideal for families - extremely safe, diverse halal dining, world-class attractions. ";
    } else if (parsedDetails.destination.includes("Indonesia")) {
      response += "Indonesia offers stunning landscapes with growing halal tourism infrastructure. ";
    } else if (parsedDetails.destination.includes("Vietnam")) {
      response += "Vietnam offers rich history and beautiful landscapes with increasing Muslim-friendly accommodations. ";
    } else if (parsedDetails.destination.includes("Philippines")) {
      response += "The Philippines has beautiful islands and growing halal tourism options, especially in major cities. ";
    }
    
    response += "What specific activities or preferences would you like me to include?";
    return response;
  }
  
  // Individual destination responses when no full trip details are provided
  if (lowercaseInput.includes("thailand") || lowercaseInput.includes("phuket") || lowercaseInput.includes("bangkok")) {
    return "Thailand is excellent for Middle Eastern families - abundant halal food, beautiful beaches, Muslim-friendly hotels. What type of Thai experience are you looking for?";
  } else if (lowercaseInput.includes("malaysia") || lowercaseInput.includes("kuala lumpur") || lowercaseInput.includes("penang")) {
    return "Malaysia is perfect for Muslim travelers - majority Muslim country, extensive halal cuisine, Islamic heritage sites. Which Malaysian destinations interest you most?";
  } else if (lowercaseInput.includes("singapore")) {
    return "Singapore is ideal for families - extremely safe, diverse halal dining, world-class attractions. What type of Singapore experience would you like to create?";
  } else if (lowercaseInput.includes("indonesia") || lowercaseInput.includes("bali") || lowercaseInput.includes("jakarta")) {
    return "Indonesia offers stunning landscapes with growing halal tourism infrastructure. Are you interested in cultural experiences or beach destinations?";
  } else if (lowercaseInput.includes("vietnam")) {
    return "Vietnam offers rich history and beautiful landscapes with increasing Muslim-friendly accommodations. Which Vietnamese cities are you considering?";
  } else if (lowercaseInput.includes("philippines")) {
    return "The Philippines has beautiful islands and growing halal tourism options, especially in major cities. What type of island experience interests you?";
  } else if (lowercaseInput.includes("create") || lowercaseInput.includes("itinerary")) {
    return "I'd love to help create an amazing Southeast Asian itinerary! Please tell me: Which country/countries? How many days? How many travelers? What's their budget range and interests?";
  } else {
    return "I'm here to help you create amazing Southeast Asian travel experiences! Feel free to ask about destinations, activities, cultural considerations, or specific itinerary requests for Thailand, Singapore, Malaysia, Indonesia, Philippines, or Vietnam.";
  }
};
