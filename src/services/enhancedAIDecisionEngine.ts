
import { marketIntelligenceService, type MarketIntelligence, type PricingRecommendation } from './marketIntelligenceService';
import { aiNegotiationService, type NegotiationContext, type AIResponse } from './aiNegotiationService';

export interface AIDecisionConfig {
  negotiationStyle: 'conservative' | 'balanced' | 'aggressive' | 'custom';
  autoAcceptThreshold: number;
  autoRejectThreshold: number;
  humanReviewRange: [number, number];
  trainingMode: boolean;
  customRules?: AICustomRule[];
}

export interface AICustomRule {
  id: string;
  name: string;
  condition: string;
  action: 'accept' | 'reject' | 'counter' | 'escalate';
  priority: number;
  isActive: boolean;
}

export interface EnhancedAIDecision {
  recommendation: 'accept' | 'counter' | 'reject' | 'escalate';
  confidence: number;
  reasoning: string[];
  marketIntelligence: {
    averageRate: number;
    seasonalTrend: string;
    competitorRates: number[];
    demandLevel: 'low' | 'medium' | 'high';
  };
  pricingStrategy: {
    suggestedCounter: number;
    maxAcceptable: number;
    walkAwayPoint: number;
    negotiationRounds: number;
  };
  timingAnalysis: {
    optimalTiming: string;
    urgencyLevel: 'low' | 'medium' | 'high';
    marketConditions: string;
  };
  riskAssessment: {
    successProbability: number;
    alternativeOptions: number;
    relationshipImpact: 'positive' | 'neutral' | 'negative';
  };
  nextSteps: string[];
}

export class EnhancedAIDecisionEngine {
  private config: AIDecisionConfig;
  private learningData: Map<string, any> = new Map();

  constructor(config: AIDecisionConfig) {
    this.config = config;
  }

  async analyzeNegotiation(
    context: NegotiationContext & {
      vendorId: string;
      negotiationHistory?: any[];
      timeConstraints?: Date;
    }
  ): Promise<EnhancedAIDecision> {
    // Get market intelligence
    const marketData = await this.getMarketIntelligence(context);
    
    // Analyze vendor patterns
    const vendorProfile = await this.analyzeVendorProfile(context.vendorId);
    
    // Calculate optimal pricing strategy
    const pricingStrategy = await this.calculatePricingStrategy(context, marketData);
    
    // Assess timing factors
    const timingAnalysis = this.analyzeNegotiationTiming(context, marketData);
    
    // Evaluate risks and opportunities
    const riskAssessment = this.assessNegotiationRisk(context, marketData, vendorProfile);
    
    // Generate recommendation
    const decision = this.generateDecision(
      context,
      marketData,
      pricingStrategy,
      timingAnalysis,
      riskAssessment
    );

    // Learn from this analysis
    this.updateLearningModel(context, decision);

    return decision;
  }

  private async getMarketIntelligence(context: NegotiationContext): Promise<{
    averageRate: number;
    seasonalTrend: string;
    competitorRates: number[];
    demandLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      const season = marketIntelligenceService.getCurrentSeason();
      const intelligence = await marketIntelligenceService.getMarketIntelligence(
        context.serviceType,
        'Thailand', // Default location
        season
      );

      if (intelligence.length === 0) {
        return {
          averageRate: context.originalRate,
          seasonalTrend: 'stable',
          competitorRates: [context.originalRate * 0.9, context.originalRate * 1.1],
          demandLevel: 'medium'
        };
      }

      const data = intelligence[0];
      return {
        averageRate: data.market_rate_avg,
        seasonalTrend: this.determineSeasonalTrend(data.seasonal_factors),
        competitorRates: [data.market_rate_min, data.market_rate_max],
        demandLevel: this.calculateDemandLevel(data.negotiation_success_rate)
      };
    } catch (error) {
      console.error('Error getting market intelligence:', error);
      return {
        averageRate: context.originalRate,
        seasonalTrend: 'stable',
        competitorRates: [context.originalRate * 0.9, context.originalRate * 1.1],
        demandLevel: 'medium'
      };
    }
  }

  private async analyzeVendorProfile(vendorId: string): Promise<{
    acceptanceRate: number;
    averageDiscount: number;
    responseTime: number;
    relationship: 'new' | 'established' | 'preferred';
  }> {
    // This would query negotiation history for this vendor
    // For now, return mock data based on vendor patterns
    return {
      acceptanceRate: 0.75,
      averageDiscount: 12.5,
      responseTime: 6, // hours
      relationship: 'established'
    };
  }

  private async calculatePricingStrategy(
    context: NegotiationContext,
    marketData: any
  ): Promise<{
    suggestedCounter: number;
    maxAcceptable: number;
    walkAwayPoint: number;
    negotiationRounds: number;
  }> {
    const variance = context.currentOffer - context.targetRate;
    const variancePercent = (variance / context.targetRate) * 100;
    
    // Calculate based on negotiation style
    const aggressiveness = this.getAggressivenessMultiplier();
    const marketPosition = context.currentOffer / marketData.averageRate;
    
    const suggestedCounter = this.calculateCounter(context, aggressiveness, marketPosition);
    const maxAcceptable = context.targetRate * (1 + (this.config.autoAcceptThreshold / 100));
    const walkAwayPoint = context.targetRate * (1 + (this.config.autoRejectThreshold / 100));
    
    return {
      suggestedCounter,
      maxAcceptable,
      walkAwayPoint,
      negotiationRounds: Math.ceil(Math.abs(variancePercent) / 10)
    };
  }

  private analyzeNegotiationTiming(
    context: NegotiationContext,
    marketData: any
  ): {
    optimalTiming: string;
    urgencyLevel: 'low' | 'medium' | 'high';
    marketConditions: string;
  } {
    const now = new Date();
    const hour = now.getHours();
    
    // Determine optimal timing based on market data and context
    const optimalTiming = this.getOptimalTiming(hour, context.serviceType);
    const urgencyLevel = context.duration && context.duration < 48 ? 'high' : 'medium';
    const marketConditions = this.assessMarketConditions(marketData);
    
    return {
      optimalTiming,
      urgencyLevel,
      marketConditions
    };
  }

  private assessNegotiationRisk(
    context: NegotiationContext,
    marketData: any,
    vendorProfile: any
  ): {
    successProbability: number;
    alternativeOptions: number;
    relationshipImpact: 'positive' | 'neutral' | 'negative';
  } {
    // Calculate success probability based on multiple factors
    const marketFactor = this.calculateMarketFactor(context.currentOffer, marketData.averageRate);
    const vendorFactor = vendorProfile.acceptanceRate;
    const timingFactor = this.calculateTimingFactor();
    
    const successProbability = (marketFactor + vendorFactor + timingFactor) / 3;
    
    return {
      successProbability: Math.min(Math.max(successProbability, 0.1), 0.95),
      alternativeOptions: this.estimateAlternatives(context.serviceType),
      relationshipImpact: this.assessRelationshipImpact(context, vendorProfile)
    };
  }

  private generateDecision(
    context: NegotiationContext,
    marketData: any,
    pricingStrategy: any,
    timingAnalysis: any,
    riskAssessment: any
  ): EnhancedAIDecision {
    const variance = ((context.currentOffer - context.targetRate) / context.targetRate) * 100;
    
    let recommendation: 'accept' | 'counter' | 'reject' | 'escalate';
    let confidence: number;
    let reasoning: string[] = [];

    // Apply decision logic based on configuration
    if (variance <= this.config.autoAcceptThreshold) {
      recommendation = 'accept';
      confidence = 0.9;
      reasoning.push(`Offer within auto-accept threshold (${this.config.autoAcceptThreshold}%)`);
      reasoning.push(`Market rate analysis supports acceptance`);
    } else if (variance >= this.config.autoRejectThreshold) {
      recommendation = 'reject';
      confidence = 0.85;
      reasoning.push(`Offer exceeds rejection threshold (${this.config.autoRejectThreshold}%)`);
      reasoning.push(`Alternative vendors available with better rates`);
    } else if (variance >= this.config.humanReviewRange[0] && variance <= this.config.humanReviewRange[1]) {
      recommendation = 'escalate';
      confidence = 0.7;
      reasoning.push(`Offer falls within human review range`);
      reasoning.push(`Complex negotiation requiring agent oversight`);
    } else {
      recommendation = 'counter';
      confidence = riskAssessment.successProbability;
      reasoning.push(`Counter-offer recommended based on market analysis`);
      reasoning.push(`${Math.round(riskAssessment.successProbability * 100)}% success probability`);
    }

    // Add market intelligence reasoning
    reasoning.push(`Market average: $${marketData.averageRate.toFixed(2)}`);
    reasoning.push(`Seasonal trend: ${marketData.seasonalTrend}`);
    reasoning.push(`Demand level: ${marketData.demandLevel}`);

    return {
      recommendation,
      confidence,
      reasoning,
      marketIntelligence: marketData,
      pricingStrategy,
      timingAnalysis,
      riskAssessment,
      nextSteps: this.generateNextSteps(recommendation, context, pricingStrategy)
    };
  }

  private generateNextSteps(
    recommendation: string,
    context: NegotiationContext,
    pricingStrategy: any
  ): string[] {
    switch (recommendation) {
      case 'accept':
        return [
          'Send acceptance email immediately',
          'Request written confirmation within 24 hours',
          'Update itinerary with confirmed rate',
          'Notify client of successful negotiation'
        ];
      case 'counter':
        return [
          `Counter-offer at $${pricingStrategy.suggestedCounter.toFixed(2)}`,
          'Highlight group booking value and repeat business',
          'Set 48-hour response deadline',
          'Prepare alternative vendor options'
        ];
      case 'reject':
        return [
          'Politely decline current offer',
          'Research alternative vendors immediately',
          'Maintain relationship for future opportunities',
          'Document rejection reasoning for learning'
        ];
      case 'escalate':
        return [
          'Flag for agent review within 2 hours',
          'Prepare detailed analysis for agent',
          'Hold vendor response pending review',
          'Schedule agent consultation if needed'
        ];
      default:
        return ['Review negotiation parameters'];
    }
  }

  // Helper methods
  private determineSeasonalTrend(seasonalFactors: any): string {
    // Mock implementation - would analyze seasonal data
    return 'stable';
  }

  private calculateDemandLevel(successRate: number): 'low' | 'medium' | 'high' {
    if (successRate > 0.8) return 'high';
    if (successRate > 0.6) return 'medium';
    return 'low';
  }

  private getAggressivenessMultiplier(): number {
    switch (this.config.negotiationStyle) {
      case 'conservative': return 0.7;
      case 'balanced': return 1.0;
      case 'aggressive': return 1.3;
      case 'custom': return 1.0; // Would use custom rules
      default: return 1.0;
    }
  }

  private calculateCounter(context: NegotiationContext, aggressiveness: number, marketPosition: number): number {
    const baseCounter = context.targetRate + (context.currentOffer - context.targetRate) * 0.6;
    return baseCounter * aggressiveness * (2 - marketPosition);
  }

  private getOptimalTiming(hour: number, serviceType: string): string {
    // Business hours are generally optimal
    if (hour >= 9 && hour <= 17) return 'Optimal (business hours)';
    if (hour >= 18 && hour <= 21) return 'Good (evening hours)';
    return 'Suboptimal (after hours)';
  }

  private assessMarketConditions(marketData: any): string {
    return `${marketData.seasonalTrend} market with ${marketData.demandLevel} demand`;
  }

  private calculateMarketFactor(currentOffer: number, averageRate: number): number {
    const ratio = currentOffer / averageRate;
    if (ratio <= 1.1) return 0.9; // Great offer
    if (ratio <= 1.2) return 0.7; // Good offer
    if (ratio <= 1.3) return 0.5; // Fair offer
    return 0.3; // Poor offer
  }

  private calculateTimingFactor(): number {
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) return 0.9; // Business hours
    if (hour >= 18 && hour <= 21) return 0.7; // Evening
    return 0.5; // After hours
  }

  private estimateAlternatives(serviceType: string): number {
    // Mock implementation - would query vendor database
    const alternativeCounts = {
      hotel: 15,
      tour: 12,
      transfer: 8,
      restaurant: 20,
      activity: 10
    };
    return alternativeCounts[serviceType] || 10;
  }

  private assessRelationshipImpact(context: NegotiationContext, vendorProfile: any): 'positive' | 'neutral' | 'negative' {
    const aggressiveness = this.getAggressivenessMultiplier();
    if (vendorProfile.relationship === 'preferred' && aggressiveness > 1.2) return 'negative';
    if (vendorProfile.relationship === 'new' && aggressiveness < 0.8) return 'positive';
    return 'neutral';
  }

  private updateLearningModel(context: NegotiationContext, decision: EnhancedAIDecision): void {
    // Store learning data for future improvements
    const key = `${context.serviceType}-${context.provider}`;
    this.learningData.set(key, {
      context,
      decision,
      timestamp: new Date(),
      outcome: null // Would be updated when negotiation completes
    });
  }

  updateConfig(newConfig: Partial<AIDecisionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async getPerformanceMetrics(): Promise<{
    accuracy: number;
    avgConfidence: number;
    successRate: number;
    avgSavings: number;
  }> {
    // Mock implementation - would analyze historical performance
    return {
      accuracy: 0.87,
      avgConfidence: 0.82,
      successRate: 0.79,
      avgSavings: 14.2
    };
  }
}

export const enhancedAIDecisionEngine = new EnhancedAIDecisionEngine({
  negotiationStyle: 'balanced',
  autoAcceptThreshold: 10,
  autoRejectThreshold: 30,
  humanReviewRange: [20, 29],
  trainingMode: true
});
