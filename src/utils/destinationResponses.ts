
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

export const getAIResponse = (input: string, parsedDetails: any): string => {
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
