import { supabase } from '@/integrations/supabase/client';

export interface NegotiationHistoryEntry {
  id: string;
  negotiation_id: string;
  action_type: 'price_offer' | 'counter_offer' | 'terms_change' | 'status_change' | 'ai_suggestion';
  actor_id: string;
  actor_role: 'agent' | 'vendor' | 'ai_system';
  previous_value?: Record<string, any>;
  new_value: Record<string, any>;
  ai_confidence_score?: number;
  notes?: string;
  created_at: string;
}

export interface NegotiationAnalytics {
  total_rounds: number;
  avg_response_time_hours: number;
  price_reduction_pct: number;
  success_factors: string[];
  timeline_events: {
    timestamp: string;
    event: string;
    actor: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

export const negotiationHistoryService = {
  async addHistoryEntry(
    negotiationId: string,
    actionType: NegotiationHistoryEntry['action_type'],
    actorId: string,
    actorRole: NegotiationHistoryEntry['actor_role'],
    data: {
      previousValue?: Record<string, any>;
      newValue: Record<string, any>;
      aiConfidenceScore?: number;
      notes?: string;
    }
  ): Promise<NegotiationHistoryEntry> {
    const { data: entry, error } = await supabase
      .from('negotiation_history')
      .insert({
        negotiation_id: negotiationId,
        action_type: actionType,
        actor_id: actorId,
        actor_role: actorRole,
        previous_value: data.previousValue,
        new_value: data.newValue,
        ai_confidence_score: data.aiConfidenceScore,
        notes: data.notes
      })
      .select()
      .single();

    if (error) throw error;
    return entry as NegotiationHistoryEntry;
  },

  async getNegotiationHistory(negotiationId: string): Promise<NegotiationHistoryEntry[]> {
    const { data, error } = await supabase
      .from('negotiation_history')
      .select(`
        *,
        users!negotiation_history_actor_id_fkey(name, email)
      `)
      .eq('negotiation_id', negotiationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as NegotiationHistoryEntry[];
  },

  async analyzeNegotiation(negotiationId: string): Promise<NegotiationAnalytics> {
    const history = await this.getNegotiationHistory(negotiationId);
    
    if (history.length === 0) {
      return {
        total_rounds: 0,
        avg_response_time_hours: 0,
        price_reduction_pct: 0,
        success_factors: [],
        timeline_events: []
      };
    }

    // Calculate rounds (offers and counter-offers)
    const priceActions = history.filter(h => 
      ['price_offer', 'counter_offer'].includes(h.action_type)
    );
    const totalRounds = Math.ceil(priceActions.length / 2);

    // Calculate average response time
    let totalResponseTimeHours = 0;
    let responseCount = 0;

    for (let i = 1; i < history.length; i++) {
      const current = new Date(history[i].created_at);
      const previous = new Date(history[i - 1].created_at);
      const diffHours = (current.getTime() - previous.getTime()) / (1000 * 60 * 60);
      
      // Only count reasonable response times (exclude weekends/holidays)
      if (diffHours <= 72) {
        totalResponseTimeHours += diffHours;
        responseCount++;
      }
    }

    const avgResponseTime = responseCount > 0 ? totalResponseTimeHours / responseCount : 0;

    // Calculate price reduction
    const firstPriceOffer = priceActions.find(h => h.action_type === 'price_offer');
    const lastPriceAction = priceActions[priceActions.length - 1];
    
    let priceReductionPct = 0;
    if (firstPriceOffer && lastPriceAction) {
      const firstPrice = firstPriceOffer.new_value.price || 0;
      const lastPrice = lastPriceAction.new_value.price || firstPrice;
      priceReductionPct = firstPrice > 0 ? ((firstPrice - lastPrice) / firstPrice) * 100 : 0;
    }

    // Identify success factors
    const successFactors = this.identifySuccessFactors(history);

    // Create timeline events
    const timelineEvents = history.map(entry => ({
      timestamp: entry.created_at,
      event: this.formatTimelineEvent(entry),
      actor: entry.actor_role,
      impact: this.assessEventImpact(entry) as 'positive' | 'negative' | 'neutral'
    }));

    return {
      total_rounds: totalRounds,
      avg_response_time_hours: Math.round(avgResponseTime * 10) / 10,
      price_reduction_pct: Math.round(priceReductionPct * 10) / 10,
      success_factors: successFactors,
      timeline_events: timelineEvents
    };
  },

  identifySuccessFactors(history: NegotiationHistoryEntry[]): string[] {
    const factors = [];

    // Quick response times
    const responseTimes = this.calculateResponseTimes(history);
    if (responseTimes.some(time => time <= 2)) {
      factors.push('Quick initial response');
    }

    // Professional communication
    const hasNotes = history.some(entry => entry.notes && entry.notes.length > 20);
    if (hasNotes) {
      factors.push('Detailed communication');
    }

    // Flexible terms
    const hasTermChanges = history.some(entry => entry.action_type === 'terms_change');
    if (hasTermChanges) {
      factors.push('Flexible terms negotiation');
    }

    // AI assistance
    const hasAiSuggestions = history.some(entry => entry.action_type === 'ai_suggestion');
    if (hasAiSuggestions) {
      factors.push('AI-guided strategy');
    }

    // Multiple offers
    const offerCount = history.filter(entry => 
      ['price_offer', 'counter_offer'].includes(entry.action_type)
    ).length;
    if (offerCount >= 4) {
      factors.push('Persistent negotiation');
    }

    return factors;
  },

  calculateResponseTimes(history: NegotiationHistoryEntry[]): number[] {
    const times = [];
    for (let i = 1; i < history.length; i++) {
      const current = new Date(history[i].created_at);
      const previous = new Date(history[i - 1].created_at);
      const diffHours = (current.getTime() - previous.getTime()) / (1000 * 60 * 60);
      times.push(diffHours);
    }
    return times;
  },

  formatTimelineEvent(entry: NegotiationHistoryEntry): string {
    switch (entry.action_type) {
      case 'price_offer':
        return `Price offer: $${entry.new_value.price || 'N/A'}`;
      case 'counter_offer':
        return `Counter offer: $${entry.new_value.price || 'N/A'}`;
      case 'terms_change':
        return 'Terms modification';
      case 'status_change':
        return `Status changed to ${entry.new_value.status || 'unknown'}`;
      case 'ai_suggestion':
        return `AI suggestion (${entry.ai_confidence_score || 0}% confidence)`;
      default:
        return 'Unknown action';
    }
  },

  assessEventImpact(entry: NegotiationHistoryEntry): string {
    switch (entry.action_type) {
      case 'price_offer':
      case 'counter_offer':
        return 'neutral'; // Price movements are neutral until final outcome
      case 'terms_change':
        return 'positive'; // Flexibility usually helps
      case 'ai_suggestion':
        return entry.ai_confidence_score && entry.ai_confidence_score > 75 ? 'positive' : 'neutral';
      case 'status_change':
        const status = entry.new_value.status;
        if (status === 'accepted') return 'positive';
        if (status === 'rejected') return 'negative';
        return 'neutral';
      default:
        return 'neutral';
    }
  },

  async getVendorNegotiationPatterns(vendorId: string): Promise<{
    avg_rounds: number;
    typical_discount: number;
    success_rate: number;
    preferred_terms: string[];
  }> {
    // Get all negotiations for this vendor
    const { data: negotiations, error } = await supabase
      .from('negotiations')
      .select('id, status')
      .eq('vendor_id', vendorId);

    if (error) throw error;

    if (negotiations.length === 0) {
      return {
        avg_rounds: 2,
        typical_discount: 15,
        success_rate: 75,
        preferred_terms: []
      };
    }

    // Analyze each negotiation
    let totalRounds = 0;
    let totalDiscounts = 0;
    let successfulNegotiations = 0;
    const allTerms: string[] = [];

    for (const negotiation of negotiations) {
      const analytics = await this.analyzeNegotiation(negotiation.id);
      totalRounds += analytics.total_rounds;
      totalDiscounts += analytics.price_reduction_pct;
      
      if (negotiation.status === 'accepted') {
        successfulNegotiations++;
      }

      // Extract terms from history
      const history = await this.getNegotiationHistory(negotiation.id);
      const termChanges = history.filter(h => h.action_type === 'terms_change');
      termChanges.forEach(change => {
        if (change.new_value.terms) {
          allTerms.push(...Object.keys(change.new_value.terms));
        }
      });
    }

    // Calculate averages
    const avgRounds = negotiations.length > 0 ? totalRounds / negotiations.length : 2;
    const typicalDiscount = negotiations.length > 0 ? totalDiscounts / negotiations.length : 15;
    const successRate = negotiations.length > 0 ? (successfulNegotiations / negotiations.length) * 100 : 75;

    // Find most common terms
    const termCounts = allTerms.reduce((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredTerms = Object.entries(termCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([term]) => term);

    return {
      avg_rounds: Math.round(avgRounds * 10) / 10,
      typical_discount: Math.round(typicalDiscount * 10) / 10,
      success_rate: Math.round(successRate * 10) / 10,
      preferred_terms: preferredTerms
    };
  }
};