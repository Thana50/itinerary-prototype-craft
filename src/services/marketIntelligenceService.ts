import { supabase } from '@/integrations/supabase/client';

export interface MarketIntelligence {
  id: string;
  service_type: string;
  location: string;
  service_name?: string;
  season: 'high' | 'shoulder' | 'low';
  market_rate_min: number;
  market_rate_avg: number;
  market_rate_max: number;
  typical_discount_pct: number;
  max_achievable_discount_pct: number;
  negotiation_success_rate: number;
  average_negotiation_rounds: number;
  optimal_timing_hours?: number[];
  seasonal_factors: Record<string, any>;
  group_size_factors: Record<string, any>;
  sample_size: number;
  confidence_score: number;
  last_updated: string;
  valid_from: string;
  valid_until?: string;
  created_at: string;
}

export interface PricingRecommendation {
  suggested_target: number;
  market_rate: number;
  discount_potential: number;
  success_probability: number;
  strategy_notes: string[];
  optimal_timing?: string;
}

export const marketIntelligenceService = {
  async getMarketIntelligence(
    serviceType: string, 
    location: string, 
    season?: string
  ): Promise<MarketIntelligence[]> {
    let query = supabase
      .from('market_intelligence')
      .select('*')
      .eq('service_type', serviceType)
      .eq('location', location)
      .gte('valid_from', new Date().toISOString().split('T')[0])
      .order('confidence_score', { ascending: false });

    if (season) {
      query = query.eq('season', season);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data as MarketIntelligence[];
  },

  async getPricingRecommendation(
    serviceType: string,
    location: string,
    estimatedPrice: number,
    participants: number = 1,
    season?: string
  ): Promise<PricingRecommendation> {
    const currentSeason = season || this.getCurrentSeason();
    
    const marketData = await this.getMarketIntelligence(serviceType, location, currentSeason);
    
    if (marketData.length === 0) {
      // Fallback to generic pricing
      return {
        suggested_target: estimatedPrice * 0.85,
        market_rate: estimatedPrice,
        discount_potential: 15,
        success_probability: 70,
        strategy_notes: ['No market data available', 'Using conservative 15% discount target'],
        optimal_timing: 'Business hours'
      };
    }

    const intelligence = marketData[0];
    const groupSizeMultiplier = this.getGroupSizeMultiplier(participants, intelligence.group_size_factors);
    const adjustedRate = intelligence.market_rate_avg * groupSizeMultiplier;
    
    // Calculate suggested target based on market intelligence
    const baseDiscount = intelligence.typical_discount_pct / 100;
    const maxDiscount = intelligence.max_achievable_discount_pct / 100;
    
    // Be more aggressive for larger groups
    const targetDiscount = participants > 4 ? maxDiscount * 0.8 : baseDiscount;
    const suggestedTarget = adjustedRate * (1 - targetDiscount);

    const strategy_notes = [
      `Market average: $${adjustedRate.toFixed(2)}`,
      `Typical discount: ${intelligence.typical_discount_pct}%`,
      `Success rate for this service: ${intelligence.negotiation_success_rate}%`
    ];

    if (participants > 4) {
      strategy_notes.push(`Group discount applies (${participants} people)`);
    }

    if (intelligence.average_negotiation_rounds > 2) {
      strategy_notes.push('Multiple rounds typically needed');
    }

    return {
      suggested_target: suggestedTarget,
      market_rate: adjustedRate,
      discount_potential: targetDiscount * 100,
      success_probability: intelligence.negotiation_success_rate,
      strategy_notes,
      optimal_timing: this.getOptimalTiming(intelligence.optimal_timing_hours)
    };
  },

  getCurrentSeason(): 'high' | 'shoulder' | 'low' {
    const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    
    // Thailand high season: Nov-Mar (11, 12, 1, 2, 3)
    if ([11, 12, 1, 2, 3].includes(month)) return 'high';
    
    // Thailand low season: May-Sep (5, 6, 7, 8, 9)
    if ([5, 6, 7, 8, 9].includes(month)) return 'low';
    
    // Shoulder season: Apr, Oct (4, 10)
    return 'shoulder';
  },

  getGroupSizeMultiplier(participants: number, groupFactors: Record<string, any>): number {
    // Default group size multipliers
    if (participants <= 2) return 1.0;
    if (participants <= 4) return 0.95; // Small group discount
    if (participants <= 8) return 0.90; // Medium group discount
    if (participants <= 15) return 0.85; // Large group discount
    return 0.80; // Very large group discount
  },

  getOptimalTiming(optimalHours?: number[]): string {
    if (!optimalHours || optimalHours.length === 0) {
      return 'Business hours (9 AM - 5 PM)';
    }

    const timeRanges = [];
    let start = optimalHours[0];
    let end = optimalHours[0];

    for (let i = 1; i < optimalHours.length; i++) {
      if (optimalHours[i] === end + 1) {
        end = optimalHours[i];
      } else {
        timeRanges.push(`${start}:00 - ${end + 1}:00`);
        start = optimalHours[i];
        end = optimalHours[i];
      }
    }
    timeRanges.push(`${start}:00 - ${end + 1}:00`);

    return timeRanges.join(', ');
  },

  async updateMarketIntelligence(
    serviceType: string,
    location: string,
    negotiationResult: {
      originalPrice: number;
      finalPrice: number;
      rounds: number;
      successful: boolean;
      season?: string;
    }
  ): Promise<void> {
    const season = negotiationResult.season || this.getCurrentSeason();
    
    // This would typically update the market intelligence based on new negotiation data
    // For now, we'll just log it as this requires complex statistical analysis
    console.log('Market intelligence update:', {
      serviceType,
      location,
      season,
      discountAchieved: ((negotiationResult.originalPrice - negotiationResult.finalPrice) / negotiationResult.originalPrice) * 100,
      rounds: negotiationResult.rounds,
      successful: negotiationResult.successful
    });
  },

  async getSeasonalTrends(serviceType: string, location: string): Promise<{
    high: MarketIntelligence | null;
    shoulder: MarketIntelligence | null;
    low: MarketIntelligence | null;
  }> {
    const { data, error } = await supabase
      .from('market_intelligence')
      .select('*')
      .eq('service_type', serviceType)
      .eq('location', location)
      .in('season', ['high', 'shoulder', 'low']);

    if (error) throw error;

    const trends = {
      high: null as MarketIntelligence | null,
      shoulder: null as MarketIntelligence | null,
      low: null as MarketIntelligence | null
    };

    data.forEach((item) => {
      if (item.season === 'high') trends.high = item as MarketIntelligence;
      if (item.season === 'shoulder') trends.shoulder = item as MarketIntelligence;
      if (item.season === 'low') trends.low = item as MarketIntelligence;
    });

    return trends;
  }
};