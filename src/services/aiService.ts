
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
    
    // Handle activity additions
    if (lowercaseMessage.includes('add')) {
      if (lowercaseMessage.includes('snorkeling') || lowercaseMessage.includes('snorkel')) {
        if (lowercaseMessage.includes('day')) {
          const dayMatch = message.match(/day\s*(\d+)/i);
          const dayNumber = dayMatch ? dayMatch[1] : "your preferred day";
          return `Excellent choice! Snorkeling is fantastic in this region with crystal-clear waters and vibrant marine life. I'll add snorkeling to Day ${dayNumber} of your itinerary. This activity is perfect for all skill levels and typically includes equipment rental.`;
        }
        return "Excellent choice! Snorkeling is fantastic in this region. Which day would you like me to add this activity to your itinerary?";
      }
      
      if (lowercaseMessage.includes('cooking class') || lowercaseMessage.includes('cooking')) {
        return "What a wonderful idea! Cooking classes are very popular and you'll learn to make authentic local dishes. Would you like me to add this to a specific day, or would you prefer it as an evening activity?";
      }
      
      if (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage')) {
        return "Perfect for relaxation! Traditional spa treatments in Southeast Asia are world-renowned. I can arrange this as a half-day experience or evening wellness session.";
      }
      
      if (lowercaseMessage.includes('cultural tour') || lowercaseMessage.includes('temple') || lowercaseMessage.includes('heritage')) {
        return "Excellent addition! Cultural experiences provide wonderful insights into local traditions and history. I can include temple visits, heritage sites, or guided cultural tours. Which day would work best for this activity?";
      }
    }
    
    // Handle accommodation changes
    if (lowercaseMessage.includes('change') && (lowercaseMessage.includes('hotel') || lowercaseMessage.includes('accommodation'))) {
      return "I'd be happy to help you find alternative accommodations. Are you looking for something more luxurious, more budget-friendly, or with specific amenities? I can suggest options that cater well to Middle Eastern travelers.";
    }
    
    if (lowercaseMessage.includes('beachfront') || (lowercaseMessage.includes('beach') && lowercaseMessage.includes('hotel'))) {
      return "Excellent choice! Beachfront properties offer stunning views and easy beach access. I'll look for oceanview accommodations with halal dining options.";
    }
    
    if (lowercaseMessage.includes('luxury') && lowercaseMessage.includes('hotel')) {
      return "Perfect! Luxury accommodations in Southeast Asia offer exceptional service and amenities. I'll find premium properties that understand the needs of Middle Eastern guests, with excellent halal dining and privacy options.";
    }
    
    // Handle duration modifications
    if (lowercaseMessage.includes('make it') && lowercaseMessage.includes('days')) {
      const daysMatch = message.match(/(\d+)\s*days?/i);
      const newDuration = daysMatch ? daysMatch[1] : "the new duration";
      return `I can definitely adjust the duration! Let me reconfigure the itinerary for ${newDuration} days to ensure we include all the best experiences without rushing.`;
    }
    
    if (lowercaseMessage.includes('extend') && lowercaseMessage.includes('days')) {
      const daysMatch = message.match(/(\d+)\s*days?/i);
      const newDuration = daysMatch ? daysMatch[1] : "the extended duration";
      return `Great idea! Extending to ${newDuration} days will allow for a more relaxed pace and additional experiences. I'll redesign the itinerary to make the most of the extra time.`;
    }
    
    // Handle food and dining requests
    if (lowercaseMessage.includes('halal food') || lowercaseMessage.includes('halal restaurants') || lowercaseMessage.includes('halal dining')) {
      return "Absolutely! I always ensure halal dining options are included. This destination has excellent halal restaurants and I'll make sure all meals meet your dietary requirements.";
    }
    
    if (lowercaseMessage.includes('local cuisine') || lowercaseMessage.includes('local food')) {
      return "Wonderful! Experiencing authentic local cuisine is one of the highlights of travel. I'll include the best local restaurants that offer halal options and cultural dining experiences.";
    }
    
    // Parse trip details first
    const tripDetails = parseTripDetails(message)
    
    // If we have trip details, use the enhanced response system
    if (Object.keys(tripDetails).length > 0) {
      return getAIResponse(message, tripDetails)
    }
    
    // Handle other agent-specific requests
    if (lowercaseMessage.includes('negotiate') || lowercaseMessage.includes('vendor')) {
      return "I can help you initiate rate negotiations with vendors. What type of service do you need pricing for? (e.g., hotels, transportation, tours, restaurants)"
    }
    
    if (lowercaseMessage.includes('share') || lowercaseMessage.includes('send')) {
      return "Great! I can help you share this itinerary with your client. Please provide their email address and I'll generate a secure link they can use to review and modify the itinerary."
    }
    
    // Handle unclear requests with helpful suggestions
    if (lowercaseMessage.length > 5 && !this.isCommonGreeting(lowercaseMessage)) {
      return "I'd love to help you customize that! Could you tell me more about what you'd like to change or add? For example, you could say 'add a cultural tour to day 3' or 'change to a luxury resort'. I'm here to make your trip perfect!";
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
    
    if (lowercaseMessage.includes('modify') || lowercaseMessage.includes('change')) {
      return "I'd be happy to help you modify your itinerary! What specific changes would you like to make? You can add activities, change hotels, adjust timing, or request different dining options."
    }
    
    if (lowercaseMessage.includes('halal') || lowercaseMessage.includes('dietary')) {
      return "Absolutely! All our itineraries include carefully vetted halal dining options. I can also recommend specific restaurants, markets for halal groceries, and hotels with halal breakfast options."
    }
    
    if (lowercaseMessage.includes('confirm') || lowercaseMessage.includes('approve')) {
      return "Excellent! I'll mark your itinerary as confirmed and send the details back to your travel agent. They'll proceed with booking all the confirmed services."
    }
    
    return "I'm here to help you review and customize your itinerary. Feel free to ask about activities, dining options, accommodations, or request any changes!"
  },

  getVendorResponse(message: string) {
    const lowercaseMessage = message.toLowerCase()
    
    if (lowercaseMessage.includes('price') || lowercaseMessage.includes('quote')) {
      return "I can help you prepare a competitive quote. Please provide your standard rates and any special offers you'd like to include. I'll help format a professional response to the travel agent."
    }
    
    if (lowercaseMessage.includes('negotiate') || lowercaseMessage.includes('counter')) {
      return "Let's work on your negotiation strategy. What's your minimum acceptable price for this service? I can help you craft a response that maintains profitability while staying competitive."
    }
    
    if (lowercaseMessage.includes('accept') || lowercaseMessage.includes('confirm')) {
      return "Perfect! I'll help you confirm this booking and send the confirmation details to the travel agent. Please provide any specific terms or requirements for this service."
    }
    
    return "I'm here to help you manage pricing negotiations and service requests from travel agents. What can I assist you with today?"
  }
}
