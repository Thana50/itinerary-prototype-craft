
export interface NegotiationContext {
  serviceType: 'hotel' | 'tour' | 'transfer' | 'restaurant' | 'activity';
  originalRate: number;
  targetRate: number;
  currentOffer: number;
  provider: string;
  service: string;
  groupSize?: number;
  duration?: number;
  season?: 'peak' | 'shoulder' | 'low';
}

export interface NegotiationStrategy {
  approach: string;
  leveragePoints: string[];
  culturalFactors: string[];
  marketContext: string;
}

export interface AIResponse {
  recommendation: 'accept' | 'counter' | 'reject';
  reasoning: string;
  suggestedCounterOffer?: number;
  marketIntelligence: string;
  nextSteps: string[];
}

export const aiNegotiationService = {
  generateStrategy(context: NegotiationContext): NegotiationStrategy {
    const { serviceType, provider, service, groupSize = 4 } = context;
    
    switch (serviceType) {
      case 'hotel':
        return {
          approach: "Group booking leverage with cultural requirements emphasis",
          leveragePoints: [
            `For a 7-night stay with ${groupSize} guests, we expect group rates`,
            "We book 50+ nights per month in Phuket area",
            "Properties with halal dining options get booking priority"
          ],
          culturalFactors: [
            "Halal dining options required",
            "Prayer room access needed",
            "Cultural sensitivity training for staff preferred"
          ],
          marketContext: "Phuket hotel rates typically 15-25% lower in shoulder season"
        };
        
      case 'tour':
        return {
          approach: "Bundle pricing with safety and cultural accommodation focus",
          leveragePoints: [
            "Multiple activity bookings warrant package discounts",
            `Private tours for ${groupSize} people should have better per-person rates`,
            "Premium safety standards expected for Middle Eastern clientele"
          ],
          culturalFactors: [
            "Tours must accommodate prayer times",
            "Halal meal options during full-day tours",
            "Cultural sensitivity regarding dress codes at temples"
          ],
          marketContext: "Island tours in Thailand typically $60-$80 per person for full day"
        };
        
      case 'transfer':
        return {
          approach: "Reliability and comfort standards with route efficiency",
          leveragePoints: [
            "Direct transfers without stops should be standard rate",
            "Clean, air-conditioned vehicles with professional drivers required",
            "On-time performance crucial for client satisfaction"
          ],
          culturalFactors: [
            "Professional driver appearance and behavior",
            "Vehicle cleanliness and comfort standards",
            "Reliability for airport connections"
          ],
          marketContext: "Airport transfers in Bangkok average $35-$45 for private van"
        };
        
      default:
        return {
          approach: "Standard negotiation with cultural awareness",
          leveragePoints: ["Volume business potential", "Repeat booking opportunity"],
          culturalFactors: ["Cultural sensitivity required"],
          marketContext: "Market rates vary by season and demand"
        };
    }
  },

  analyzeOffer(context: NegotiationContext): AIResponse {
    const { originalRate, targetRate, currentOffer, serviceType } = context;
    const savingsFromOriginal = ((originalRate - currentOffer) / originalRate) * 100;
    const differenceFromTarget = ((currentOffer - targetRate) / targetRate) * 100;
    
    if (differenceFromTarget <= 10) {
      return {
        recommendation: 'accept',
        reasoning: `Excellent offer! This rate is competitive and represents ${savingsFromOriginal.toFixed(1)}% savings from original price.`,
        marketIntelligence: this.getMarketIntelligence(serviceType, 'good'),
        nextSteps: [
          "Accept the offer immediately",
          "Confirm booking details and payment terms",
          "Request written confirmation within 24 hours"
        ]
      };
    } else if (differenceFromTarget <= 20) {
      const suggestedCounter = targetRate + (targetRate * 0.05); // 5% above target
      return {
        recommendation: 'counter',
        reasoning: `Reasonable offer but we can improve. At $${currentOffer}, this is ${differenceFromTarget.toFixed(1)}% above our target.`,
        suggestedCounterOffer: suggestedCounter,
        marketIntelligence: this.getMarketIntelligence(serviceType, 'mediocre'),
        nextSteps: [
          `Counter-offer at $${suggestedCounter.toFixed(0)}`,
          "Highlight volume business and repeat bookings",
          "Emphasize long-term partnership potential"
        ]
      };
    } else {
      const suggestedCounter = targetRate;
      return {
        recommendation: 'reject',
        reasoning: `Rate too high for our budget. At $${currentOffer}, this is ${differenceFromTarget.toFixed(1)}% above market expectations.`,
        suggestedCounterOffer: suggestedCounter,
        marketIntelligence: this.getMarketIntelligence(serviceType, 'poor'),
        nextSteps: [
          `Firm counter-offer at $${suggestedCounter.toFixed(0)}`,
          "Present market research and competitor rates",
          "Consider alternative providers if no movement"
        ]
      };
    }
  },

  getMarketIntelligence(serviceType: string, offerQuality: 'good' | 'mediocre' | 'poor'): string {
    const intelligence = {
      hotel: {
        good: "This rate aligns with market standards for premium properties in Phuket during shoulder season.",
        mediocre: "Similar beachfront properties in Phuket offer group rates 10-15% below this level.",
        poor: "Market research shows comparable resorts pricing 20-25% lower with similar amenities."
      },
      tour: {
        good: "Competitive pricing for private island tours with cultural accommodation requirements.",
        mediocre: "Full-day private tours typically offer 15% group discounts for 4+ participants.",
        poor: "Alternative tour operators in Phi Phi offer similar services at 25-30% lower rates."
      },
      transfer: {
        good: "Fair pricing for premium airport transfer service with professional standards.",
        mediocre: "Private van transfers in Bangkok market typically 10% lower for direct routes.",
        poor: "Multiple providers offer similar service quality at $35-$40 range."
      }
    };
    
    return intelligence[serviceType as keyof typeof intelligence]?.[offerQuality] || 
           "Market conditions suggest room for further negotiation.";
  },

  generateNegotiationMessage(strategy: NegotiationStrategy, context: NegotiationContext): string {
    const { leveragePoints, culturalFactors } = strategy;
    const { service, targetRate } = context;
    
    return `Thank you for your offer on ${service}. We appreciate your quick response.

Key considerations for our partnership:
${leveragePoints.map(point => `• ${point}`).join('\n')}

Cultural requirements for our Middle Eastern clientele:
${culturalFactors.map(factor => `• ${factor}`).join('\n')}

Based on our market analysis and the value we bring as a repeat partner, we'd like to propose $${targetRate} for this service. This rate reflects:
- Volume business potential (50+ bookings monthly)
- Long-term partnership opportunity
- Cultural sensitivity and service excellence requirements

We believe this creates a win-win partnership that values both competitive pricing and service excellence. 

Looking forward to your response.`;
  }
};
