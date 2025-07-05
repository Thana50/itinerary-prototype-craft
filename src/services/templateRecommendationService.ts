
import { ItineraryTemplate } from '@/types/templates';
import { templateService } from './templateService';

interface RecommendationContext {
  destination?: string;
  duration?: number;
  travelers?: number;
  budget?: 'budget' | 'mid' | 'luxury';
  interests?: string[];
  season?: string;
}

interface TemplateRecommendation {
  template: ItineraryTemplate;
  confidence: number;
  reason: string;
  contextualNote?: string;
}

export const templateRecommendationService = {
  async analyzeInput(input: string): Promise<RecommendationContext> {
    const context: RecommendationContext = {};
    const lowerInput = input.toLowerCase();

    // Destination detection
    const destinations = ['phuket', 'bangkok', 'singapore', 'bali', 'kuala lumpur', 'ho chi minh', 'hanoi'];
    for (const dest of destinations) {
      if (lowerInput.includes(dest)) {
        context.destination = dest.charAt(0).toUpperCase() + dest.slice(1);
        break;
      }
    }

    // Duration detection
    const durationMatch = lowerInput.match(/(\d+)\s*(day|night|week)/i);
    if (durationMatch) {
      let days = parseInt(durationMatch[1]);
      if (durationMatch[2].toLowerCase().includes('week')) days *= 7;
      context.duration = days;
    }

    // Traveler count detection
    const travelerMatch = lowerInput.match(/(\d+)\s*(people|person|traveler|guest|pax)/i);
    if (travelerMatch) {
      context.travelers = parseInt(travelerMatch[1]);
    }

    // Budget detection
    if (lowerInput.includes('budget') || lowerInput.includes('cheap') || lowerInput.includes('affordable')) {
      context.budget = 'budget';
    } else if (lowerInput.includes('luxury') || lowerInput.includes('premium') || lowerInput.includes('high-end')) {
      context.budget = 'luxury';
    } else if (lowerInput.includes('mid-range') || lowerInput.includes('moderate')) {
      context.budget = 'mid';
    }

    // Interest detection
    const interests = [];
    if (lowerInput.includes('family') || lowerInput.includes('kid') || lowerInput.includes('children')) {
      interests.push('family');
    }
    if (lowerInput.includes('adventure') || lowerInput.includes('active') || lowerInput.includes('outdoor')) {
      interests.push('adventure');
    }
    if (lowerInput.includes('cultural') || lowerInput.includes('temple') || lowerInput.includes('history')) {
      interests.push('cultural');
    }
    if (lowerInput.includes('beach') || lowerInput.includes('island') || lowerInput.includes('water')) {
      interests.push('beach');
    }
    context.interests = interests;

    // Season detection
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) context.season = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) context.season = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) context.season = 'autumn';
    else context.season = 'winter';

    return context;
  },

  async getRecommendations(context: RecommendationContext): Promise<TemplateRecommendation[]> {
    const allTemplates = await templateService.getPopularTemplates();
    const recommendations: TemplateRecommendation[] = [];

    for (const template of allTemplates) {
      let confidence = 0;
      let reasons = [];

      // Destination match
      if (context.destination && template.destination.toLowerCase().includes(context.destination.toLowerCase())) {
        confidence += 40;
        reasons.push(`matches ${context.destination}`);
      }

      // Duration match
      if (context.duration) {
        const durationDiff = Math.abs(template.duration - context.duration);
        if (durationDiff === 0) {
          confidence += 30;
          reasons.push('exact duration match');
        } else if (durationDiff <= 2) {
          confidence += 20;
          reasons.push('similar duration');
        }
      }

      // Budget match
      if (context.budget) {
        if (template.category === context.budget) {
          confidence += 25;
          reasons.push(`${context.budget} category match`);
        }
      }

      // Interest match
      if (context.interests) {
        for (const interest of context.interests) {
          if (template.category === interest || template.tags.includes(interest)) {
            confidence += 15;
            reasons.push(`${interest} interest match`);
          }
        }
      }

      // Success rate boost
      if (template.successRate > 90) {
        confidence += 10;
        reasons.push('high success rate');
      }

      if (confidence > 30) {
        const contextualNote = this.generateContextualNote(template, context);
        recommendations.push({
          template,
          confidence: Math.min(confidence, 100),
          reason: reasons.join(', '),
          contextualNote
        });
      }
    }

    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  },

  generateContextualNote(template: ItineraryTemplate, context: RecommendationContext): string {
    const notes = [];

    // Success rate context
    if (template.successRate > 95) {
      notes.push(`You've had ${template.successRate}% success with this template`);
    }

    // Usage frequency
    if (template.timesUsed > 20) {
      notes.push('One of our most popular templates');
    }

    // Seasonal context
    if (context.season === 'summer' && template.tags.includes('beach')) {
      notes.push('Perfect for summer - includes indoor alternatives for hot days');
    }

    // Recent success
    const daysSinceLastUsed = Math.floor((new Date().getTime() - new Date(template.lastUsed).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastUsed < 7) {
      notes.push('Recently used with great client feedback');
    }

    // Special highlights
    if (template.tags.includes('cultural') && template.destination.includes('Thailand')) {
      notes.push('Clients especially love the temple visits and local markets');
    }

    return notes.length > 0 ? notes[0] : '';
  },

  async getInlineRecommendation(input: string): Promise<string | null> {
    const context = await this.analyzeInput(input);
    const recommendations = await this.getRecommendations(context);

    if (recommendations.length > 0 && recommendations[0].confidence > 70) {
      const template = recommendations[0].template;
      return `This sounds like our '${template.name}' template - ${template.successRate}% success rate!`;
    }

    return null;
  }
};
