import { parseTripDetails, generateSampleItinerary, getAIResponse } from '@/utils/tripUtils'

// For demo purposes, we'll simulate AI responses. In production, this would use OpenAI/Claude API
export const aiService = {
  async generateItineraryResponse(message: string, userRole: 'agent' | 'traveler' | 'vendor') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (userRole === 'agent') {
      return this.getAgentResponse(message)
    } else if (userRole === 'traveler') {
      return this.getTravelerResponse(message)
    } else if (userRole === 'vendor') {
      return this.getVendorResponse(message)
    }
    
    return "I'm here to help with your travel planning needs!"
  },

  getAgentResponse(message: string) {
    const lowercaseMessage = message.toLowerCase()
    
    // Handle activity additions with professional expertise
    if (lowercaseMessage.includes('add')) {
      if (lowercaseMessage.includes('snorkeling') || lowercaseMessage.includes('snorkel')) {
        if (lowercaseMessage.includes('day')) {
          const dayMatch = message.match(/day\s*(\d+)/i);
          const dayNumber = dayMatch ? dayMatch[1] : "your preferred day";
          return `Excellent choice! Based on my experience with similar itineraries, snorkeling is fantastic in this region with crystal-clear waters and vibrant marine life. I'll add snorkeling to Day ${dayNumber} of your itinerary. This activity is perfect for all skill levels and typically includes equipment rental. Many of my Middle Eastern clients love the underwater experiences here!`;
        }
        return "Excellent choice! Based on my experience, snorkeling is fantastic in this region. Which day would you like me to add this activity to your itinerary? A tip from my local contacts: the morning sessions usually offer the best visibility.";
      }
      
      if (lowercaseMessage.includes('cooking class') || lowercaseMessage.includes('cooking')) {
        return "What a wonderful idea! Thai cooking classes are very popular with our guests. I can arrange this on Day 3 evening or Day 4 afternoon. You'll learn to make authentic Pad Thai, Green Curry, and Mango Sticky Rice. Would you prefer a half-day class or just a 2-hour evening session?"
      }
      
      if (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage')) {
        return "Perfect for relaxation! Traditional spa treatments in Southeast Asia are world-renowned. Based on my experience with similar itineraries, I can arrange this as a half-day experience or evening wellness session. Many of my Middle Eastern clients love these traditional treatments, and the hotels provide prayer facilities nearby.";
      }
      
      if (lowercaseMessage.includes('cultural tour') || lowercaseMessage.includes('temple') || lowercaseMessage.includes('heritage')) {
        return "Excellent selection! Cultural experiences provide wonderful insights into local traditions and history, and this destination consistently receives outstanding feedback for its heritage sites. I often recommend temple visits, heritage sites, or guided cultural tours. Which day would work best for this activity? The experience is particularly special because of the respectful way local guides present their culture.";
      }
    }
    
    // Handle accommodation changes with professional expertise
    if (lowercaseMessage.includes('change') && (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('accommodation'))) {
      return "Absolutely! I'd be happy to help you find alternative accommodations. Are you looking for something more luxurious, more budget-friendly, or with specific amenities? Based on my experience, I can suggest options that cater well to Middle Eastern travelers with excellent halal dining and prayer facilities.";
    }
    
    if (lowercaseMessage.includes('beachfront') || (lowercaseMessage.includes('beach') && lowercaseMessage.includes('hotel'))) {
      return "Excellent choice! Beachfront properties offer stunning views and easy beach access. I often recommend these for families as they're perfect for children. I'll look for oceanview accommodations with halal dining options and prayer facilities. You're going to love the sunset views!";
    }
    
    if (lowercaseMessage.includes('luxury') && lowercaseMessage.includes('hotel')) {
      return "Perfect! Luxury accommodations in Southeast Asia offer exceptional service and amenities. Based on my experience with similar itineraries, I'll find premium properties that understand the needs of Middle Eastern guests, with excellent halal dining, privacy options, and dedicated prayer areas. This itinerary combines the best of luxury and cultural authenticity.";
    }
    
    // Handle duration modifications with professional language
    if (lowercaseMessage.includes('make it') && lowercaseMessage.includes('days')) {
      const daysMatch = message.match(/(\d+)\s*days?/i);
      const newDuration = daysMatch ? daysMatch[1] : "the new duration";
      return `Absolutely! I can definitely adjust the duration! Let me reconfigure the itinerary for ${newDuration} days to ensure we include all the best experiences without rushing. Based on my experience, this will allow for a perfect balance of activities and relaxation time.`;
    }
    
    if (lowercaseMessage.includes('extend') && lowercaseMessage.includes('days')) {
      const daysMatch = message.match(/(\d+)\s*days?/i);
      const newDuration = daysMatch ? daysMatch[1] : "the extended duration";
      return `That's a wonderful idea! Extending to ${newDuration} days will allow for a more relaxed pace and additional experiences. I often recommend this approach as it provides time to truly immerse in the local culture. I'll redesign the itinerary to make the most of the extra time.`;
    }
    
    // Handle food and dining requests with cultural sensitivity
    if (lowercaseMessage.includes('halal food') || lowercaseMessage.includes('halal restaurants') || lowercaseMessage.includes('halal dining')) {
      return "Absolutely! I always ensure halal dining options are included - this is one of my specialties. This destination has excellent halal restaurants and I'll make sure all meals meet your dietary requirements. Many of my Middle Eastern clients love the variety of authentic halal cuisine available here.";
    }
    
    if (lowercaseMessage.includes('local cuisine') || lowercaseMessage.includes('local food')) {
      return "Wonderful! Experiencing authentic local cuisine is one of the highlights of travel, and this destination offers amazing opportunities for this. I'll include the best local restaurants that offer halal options and cultural dining experiences. The local people are very welcoming and proud to share their culinary traditions.";
    }
    
    // Parse trip details first
    const tripDetails = parseTripDetails(message)
    
    // If we have trip details, use the enhanced response system
    if (Object.keys(tripDetails).length > 0) {
      return getAIResponse(message, tripDetails)
    }
    
    // Handle other agent-specific requests with professional expertise
    if (lowercaseMessage.includes('negotiate') || lowercaseMessage.includes('vendor')) {
      return "I can help you initiate rate negotiations with vendors. Based on my experience, what type of service do you need pricing for? (e.g., hotels, transportation, tours, restaurants) I have several excellent contacts and can find the perfect solution for your budget."
    }
    
    if (lowercaseMessage.includes('share') || lowercaseMessage.includes('send')) {
      return "Excellent! I can help you share this itinerary with your client. Please provide their email address and I'll generate a secure link they can use to review and modify the itinerary. This is one of our most popular features for client collaboration."
    }
    
    // Handle unclear requests with helpful suggestions and professional tone
    if (lowercaseMessage.length > 5 && !this.isCommonGreeting(lowercaseMessage)) {
      return "I'd love to help you customize that! Could you tell me more about what you'd like to change or add? For example, you could say 'add a cultural tour to day 3' or 'change to a luxury resort'. Based on my experience helping hundreds of families, I can absolutely accommodate any preference you have to make your trip perfect!";
    }
    
    // Use the enhanced AI response system for general queries
    return getAIResponse(message, {})
  },

  isCommonGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  },

  getTravelerResponse(message: string) {
    const lowercaseMessage = message.toLowerCase()
    
    // ADDING ACTIVITIES
    if (lowercaseMessage.includes('cooking class') || lowercaseMessage.includes('cooking')) {
      return "What a wonderful idea! Thai cooking classes are very popular with our guests. I can arrange this on Day 3 evening or Day 4 afternoon. You'll learn to make authentic Pad Thai, Green Curry, and Mango Sticky Rice. Would you prefer a half-day class or just a 2-hour evening session?"
    }
    
    if (lowercaseMessage.includes('add') && (lowercaseMessage.includes('beach') || lowercaseMessage.includes('more beach'))) {
      return "Absolutely! Phuket's beaches are world-famous. I can extend your beach activities on Day 1 and add a full beach day on Day 5. Would you like water sports like parasailing or jet skiing, or prefer pure relaxation?"
    }
    
    if ((lowercaseMessage.includes('visit') || lowercaseMessage.includes('add')) && (lowercaseMessage.includes('temple') || lowercaseMessage.includes('temples'))) {
      return "Excellent choice! Thailand has beautiful Buddhist temples. The Big Buddha is already included on Day 3, but I can add Wat Chalong temple and Wat Phra Thong for a more comprehensive cultural experience."
    }
    
    if (lowercaseMessage.includes('add') && (lowercaseMessage.includes('snorkel') || lowercaseMessage.includes('snorkeling'))) {
      return "Perfect choice! The snorkeling in Phuket is incredible with crystal-clear waters and vibrant coral reefs. You already have snorkeling at Maya Bay on Day 2, but I can add another session at Coral Island or Racha Island. Would you prefer a morning or afternoon session?"
    }
    
    if (lowercaseMessage.includes('add') && (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage'))) {
      return "Wonderful idea! Thai massages are world-renowned for their therapeutic benefits. You already have a traditional Thai massage on Day 3, but I can add a luxury spa day with aromatherapy and hot stone treatments. Would you prefer this on Day 5 for relaxation before departure?"
    }
    
    // DIETARY PREFERENCES
    if (lowercaseMessage.includes('halal')) {
      return "Absolutely! All meals in your itinerary include halal options. Phuket has excellent halal restaurants, and I've ensured your tour guides know about dietary requirements. I can also add a halal food tour if you're interested!"
    }
    
    if (lowercaseMessage.includes('vegetarian')) {
      return "Perfect! Thai cuisine has amazing vegetarian dishes. I'll make sure all restaurants on your itinerary have vegetarian menus, and the cooking class can focus on vegetarian Thai dishes."
    }
    
    if (lowercaseMessage.includes('food') && lowercaseMessage.includes('allerg')) {
      return "Of course! I'll make sure all restaurants and tour operators are informed about any food allergies. Thai cuisine can be adapted for most dietary restrictions. Could you tell me specifically what allergies I should note for your group?"
    }
    
    // ACCOMMODATION CHANGES
    if (lowercaseMessage.includes('upgrade') && lowercaseMessage.includes('hotel')) {
      return "I'd be happy to suggest luxury upgrades! Are you interested in beachfront resorts, hotels with private pools, or properties with special amenities? I can show you options that maintain halal dining and family-friendly environments."
    }
    
    if (lowercaseMessage.includes('different') && (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('location'))) {
      return "Certainly! Would you prefer to stay closer to Patong Beach for nightlife and shopping, or in a quieter area like Kata Beach for family relaxation? I can adjust your accommodation and update the daily activities accordingly."
    }
    
    if (lowercaseMessage.includes('beachfront') || lowercaseMessage.includes('ocean view')) {
      return "Excellent choice! Beachfront properties offer stunning sunset views and direct beach access. I can upgrade you to an oceanview suite with balcony. These hotels also have excellent halal dining options and are perfect for families with children."
    }
    
    // BUDGET CONCERNS
    if (lowercaseMessage.includes('cheaper') || lowercaseMessage.includes('less expensive') || lowercaseMessage.includes('budget')) {
      return "I understand! I can suggest more budget-friendly alternatives while keeping the quality high. Would you like me to focus on group tours instead of private ones, or look at different accommodation options?"
    }
    
    if (lowercaseMessage.includes('cost') || lowercaseMessage.includes('price') || lowercaseMessage.includes('total')) {
      return "Based on your current itinerary for 4 people, the estimated cost is $2,800-$3,200 total. This includes accommodation, activities, meals, and transfers. I can break this down by category if you'd like."
    }
    
    // ACTIVITY MODIFICATIONS
    if (lowercaseMessage.includes('remove') || lowercaseMessage.includes('skip')) {
      return "No problem! I can adjust your itinerary by removing activities. Which specific activity would you like to skip? I can replace it with free time or suggest alternative activities that might interest you more."
    }
    
    if (lowercaseMessage.includes('change day') || lowercaseMessage.includes('move to')) {
      return "Absolutely! I can reschedule activities between days. Which activity would you like to move, and which day would you prefer? I'll make sure the new schedule flows well and doesn't conflict with other bookings."
    }
    
    // FAMILY-SPECIFIC REQUESTS
    if (lowercaseMessage.includes('kids') || lowercaseMessage.includes('children') || lowercaseMessage.includes('family')) {
      return "Perfect! This itinerary is designed to be family-friendly. All activities are suitable for children, and I can add more kid-focused experiences like the Phuket Aquarium or mini-golf. The hotels have family pools and kids' clubs too."
    }
    
    // WEATHER/TIMING CONCERNS
    if (lowercaseMessage.includes('weather') || lowercaseMessage.includes('rain')) {
      return "Great question! March is an excellent time to visit Phuket with minimal rainfall and perfect beach weather. All outdoor activities have indoor alternatives if needed, and I can suggest covered attractions for any unexpected weather."
    }
    
    // TRANSPORTATION
    if (lowercaseMessage.includes('transport') || lowercaseMessage.includes('transfer')) {
      return "All transfers are included in your package! You'll have private air-conditioned vehicles for airport transfers and day trips. For longer distances, I can arrange comfortable coaches with prayer time considerations built into the schedule."
    }
    
    // GENERAL MODIFICATION REQUESTS
    if (lowercaseMessage.includes('modify') || lowercaseMessage.includes('change')) {
      return "I'd be happy to help you modify your itinerary! What specific changes would you like to make? You can add activities, change hotels, adjust timing, or request different dining options. I'm here to make this trip perfect for your family."
    }
    
    if (lowercaseMessage.includes('confirm') || lowercaseMessage.includes('approve')) {
      return "Excellent! I'll mark your itinerary as confirmed and send the details back to your travel agent. They'll proceed with booking all the confirmed services. You're going to love this amazing Phuket adventure!"
    }
    
    // UNCLEAR REQUESTS - catch-all for anything not specifically handled
    if (lowercaseMessage.length > 5 && !this.isCommonGreeting(lowercaseMessage)) {
      return "I'd love to help you customize that! Could you tell me more about what you have in mind? For example, are you looking for more cultural activities, adventure sports, relaxation time, or family-friendly attractions?"
    }
    
    return "I'm here to help you review and customize your itinerary. Feel free to ask about activities, dining options, accommodations, or request any changes! This trip is designed to be perfect for families with all dietary requirements accommodated."
  },

  getVendorResponse(message: string) {
    const lowercaseMessage = message.toLowerCase()
    
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('quote')) {
      return "I can help you prepare a competitive quote. Please provide your standard rates and any special offers you'd like to include. Based on my experience with similar negotiations, I'll help format a professional response to the travel agent."
    }
    
    if (lowercaseMessage.includes('negotiate') || lowercaseMessage.includes('counter')) {
      return "Let me work on your negotiation strategy. What's your minimum acceptable price for this service? I can help you craft a response that maintains profitability while staying competitive. I have several excellent approaches we can use."
    }
    
    if (lowercaseMessage.includes('accept') || lowercaseMessage.includes('confirm')) {
      return "Perfect! I'll help you confirm this booking and send the confirmation details to the travel agent. Please provide any specific terms or requirements for this service. This is going to be an excellent partnership."
    }
    
    return "I'm here to help you manage pricing negotiations and service requests from travel agents. Based on my experience, what can I assist you with today?"
  }
}
