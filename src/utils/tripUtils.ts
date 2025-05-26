
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
  
  // Handle activity requests and modifications
  if (lowercaseInput.includes("add") && (lowercaseInput.includes("snorkeling") || lowercaseInput.includes("snorkel"))) {
    if (lowercaseInput.includes("day")) {
      const dayMatch = input.match(/day\s*(\d+)/i);
      const dayNumber = dayMatch ? dayMatch[1] : "your preferred day";
      return `Excellent choice! Snorkeling is fantastic in this region with crystal-clear waters and vibrant marine life. I'll add snorkeling to Day ${dayNumber} of your itinerary. This activity is perfect for all skill levels and typically includes equipment rental.`;
    }
    return "Excellent choice! Snorkeling is fantastic in this region. Which day would you like me to add this activity to your itinerary?";
  }

  if (lowercaseInput.includes("add") && lowercaseInput.includes("cooking class")) {
    return "What a wonderful idea! Cooking classes are very popular and you'll learn to make authentic local dishes with fresh ingredients. These classes often include market visits and are very family-friendly. Would you like me to add this to a specific day, or shall I suggest the best day based on your itinerary flow?";
  }

  if (lowercaseInput.includes("add") && (lowercaseInput.includes("diving") || lowercaseInput.includes("scuba"))) {
    return "Fantastic choice! This destination offers world-class diving with excellent visibility and diverse marine life. I can arrange PADI-certified dive centers that cater to all experience levels. Would you like me to add diving to a specific day, and do you need certification courses or are you already certified?";
  }

  if (lowercaseInput.includes("add") && (lowercaseInput.includes("spa") || lowercaseInput.includes("massage"))) {
    return "Perfect for relaxation! The region is famous for traditional spa treatments and therapeutic massages. I can recommend spas that offer authentic local treatments in a serene setting. Which day would work best for your spa experience?";
  }

  if (lowercaseInput.includes("change") && lowercaseInput.includes("hotel")) {
    return "I'd be happy to help you find alternative accommodations! Are you looking for something more luxurious, more budget-friendly, closer to specific attractions, or with particular amenities like family rooms, halal breakfast, or beachfront location? Let me know your preferences and I'll suggest the perfect alternatives.";
  }

  if (lowercaseInput.includes("halal food") || lowercaseInput.includes("halal dining") || lowercaseInput.includes("halal restaurant")) {
    return "Absolutely! I always ensure halal dining options are included in all our itineraries. This destination has excellent halal restaurants ranging from local street food to fine dining. I can also recommend hotels with halal breakfast options and markets where you can find halal ingredients if you prefer to cook.";
  }

  if (lowercaseInput.includes("add") && (lowercaseInput.includes("temple") || lowercaseInput.includes("mosque") || lowercaseInput.includes("cultural"))) {
    return "Excellent choice for cultural immersion! I'll include visits to significant religious and cultural sites that showcase the rich heritage of the region. These sites are not only beautiful but also provide deep insights into local traditions and history. Would you like me to focus on specific types of cultural experiences?";
  }

  if (lowercaseInput.includes("change") || lowercaseInput.includes("modify") || lowercaseInput.includes("update")) {
    return "I'd love to help you customize your itinerary! Could you tell me more specifically about what you'd like to change or add? For example, activities, accommodations, dining preferences, or timing? The more details you provide, the better I can tailor your perfect trip.";
  }

  if (lowercaseInput.includes("remove") || lowercaseInput.includes("delete") || lowercaseInput.includes("take out")) {
    return "No problem! I can adjust your itinerary by removing or replacing activities. What specifically would you like me to remove, and would you like me to suggest alternative activities for that time slot?";
  }

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
