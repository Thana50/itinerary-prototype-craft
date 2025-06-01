
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
    
    // Use the enhanced AI response system for general queries
    return getAIResponse(message, {})
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
