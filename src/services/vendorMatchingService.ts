import { supabase } from '@/integrations/supabase/client';

export interface VendorProfile {
  user_id: string;
  company_name: string;
  contact_person?: string;
  phone?: string;
  service_specializations: string[];
  coverage_areas: string[];
  response_time_avg_hours: number;
  success_rate: number;
  preferred_partner: boolean;
  business_license?: string;
  contract_terms: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VendorService {
  id: string;
  vendor_id: string;
  service_type: string;
  service_name: string;
  location?: string;
  base_price?: number;
  negotiable_discount_max?: number;
  capacity?: number;
  description?: string;
  specializations: any[];
  availability: Record<string, any>;
  market_rate_reference?: number;
  created_at: string;
}

export interface VendorMatch {
  vendor: VendorProfile;
  services: VendorService[];
  match_score: number;
  recommendation_reason: string[];
  estimated_response_time: number;
  success_probability: number;
}

export const vendorMatchingService = {
  async findMatchingVendors(
    serviceType: string,
    location: string,
    requirements: {
      participants?: number;
      specialRequirements?: Record<string, any>;
      budget?: number;
      priority?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<VendorMatch[]> {
    try {
      // For PoC, get demo vendor by email first
      const { data: demoVendorUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'vendor@demo.com')
        .single();

      if (demoVendorUser) {
        // Try to get the demo vendor's profile
        const { data: demoVendorProfile } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('user_id', demoVendorUser.id)
          .single();

        if (demoVendorProfile) {
          // Get demo vendor's services
          const { data: demoVendorServices } = await supabase
            .from('vendor_services')
            .select('*')
            .eq('vendor_id', demoVendorUser.id);

          // Return demo vendor as primary match
          const demoMatch: VendorMatch = {
            vendor: demoVendorProfile as VendorProfile,
            services: (demoVendorServices || []) as VendorService[],
            match_score: 95, // High score for demo purposes
            recommendation_reason: ['Demo vendor for PoC', 'Covers all service types', 'Fast response time'],
            estimated_response_time: demoVendorProfile.response_time_avg_hours || 2,
            success_probability: demoVendorProfile.success_rate || 90
          };

          console.log('Found demo vendor match:', demoMatch);
          return [demoMatch];
        }
      }

      // Fallback to original matching logic if demo vendor not found
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          users!inner(id, name, email, role)
        `)
        .contains('service_specializations', [serviceType])
        .contains('coverage_areas', [location]);

      if (vendorError) {
        console.error('Vendor matching error:', vendorError);
        return [];
      }

      // Get vendor services for the specific service type
      const vendorIds = vendorData.map(v => v.user_id);
      const { data: servicesData, error: servicesError } = await supabase
        .from('vendor_services')
        .select('*')
        .in('vendor_id', vendorIds)
        .eq('service_type', serviceType);

      if (servicesError) {
        console.error('Services matching error:', servicesError);
        return [];
      }

      // Calculate matches
      const matches: VendorMatch[] = [];

      for (const vendor of vendorData) {
        const vendorServices = servicesData?.filter(s => s.vendor_id === vendor.user_id) || [];
        
        if (vendorServices.length === 0) continue;

        const matchScore = this.calculateMatchScore(vendor, vendorServices, requirements);
        const recommendationReasons = this.getRecommendationReasons(vendor, vendorServices, requirements);

        matches.push({
          vendor: vendor as VendorProfile,
          services: vendorServices as VendorService[],
          match_score: matchScore,
          recommendation_reason: recommendationReasons,
          estimated_response_time: vendor.response_time_avg_hours,
          success_probability: vendor.success_rate
        });
      }

      // Sort by match score descending
      return matches.sort((a, b) => b.match_score - a.match_score);
    } catch (error) {
      console.error('Error in findMatchingVendors:', error);
      return [];
    }
  },

  calculateMatchScore(
    vendor: any,
    services: VendorService[],
    requirements: any
  ): number {
    let score = 0;

    // Base score from vendor success rate (0-40 points)
    score += (vendor.success_rate / 100) * 40;

    // Preferred partner bonus (0-10 points)
    if (vendor.preferred_partner) {
      score += 10;
    }

    // Response time score (0-20 points, lower is better)
    const responseTimeScore = Math.max(0, 20 - (vendor.response_time_avg_hours / 24) * 20);
    score += responseTimeScore;

    // Service availability score (0-20 points)
    const serviceScore = services.length > 0 ? 20 : 0;
    score += serviceScore;

    // Budget compatibility (0-10 points)
    if (requirements.budget && services.length > 0) {
      const bestService = services.find(s => s.base_price && s.base_price <= requirements.budget);
      if (bestService) {
        score += 10;
      } else if (services.some(s => s.base_price && s.negotiable_discount_max)) {
        // Check if negotiable discount could meet budget
        const negotiableService = services.find(s => {
          const discountedPrice = (s.base_price || 0) * (1 - (s.negotiable_discount_max || 0) / 100);
          return discountedPrice <= (requirements.budget || 0);
        });
        if (negotiableService) score += 5;
      }
    }

    return Math.min(100, score);
  },

  getRecommendationReasons(
    vendor: any,
    services: VendorService[],
    requirements: any
  ): string[] {
    const reasons = [];

    if (vendor.success_rate > 80) {
      reasons.push(`High success rate (${vendor.success_rate}%)`);
    }

    if (vendor.preferred_partner) {
      reasons.push('Preferred partner status');
    }

    if (vendor.response_time_avg_hours <= 12) {
      reasons.push('Fast response time');
    }

    if (services.some(s => s.capacity && s.capacity >= (requirements.participants || 1))) {
      reasons.push('Adequate capacity for group size');
    }

    if (requirements.budget && services.some(s => s.base_price && s.base_price <= requirements.budget)) {
      reasons.push('Within budget range');
    }

    if (services.some(s => s.negotiable_discount_max && s.negotiable_discount_max > 15)) {
      reasons.push('Good negotiation potential');
    }

    if (vendor.business_license) {
      reasons.push('Licensed operator');
    }

    return reasons;
  },

  async getVendorProfile(vendorId: string): Promise<VendorProfile | null> {
    const { data, error } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('user_id', vendorId)
      .single();

    if (error) return null;
    return data as VendorProfile;
  },

  async getVendorServices(vendorId: string, serviceType?: string): Promise<VendorService[]> {
    let query = supabase
      .from('vendor_services')
      .select('*')
      .eq('vendor_id', vendorId);

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data as VendorService[];
  },

  async updateVendorPerformance(
    vendorId: string,
    negotiationResult: {
      responseTimeHours: number;
      successful: boolean;
    }
  ): Promise<void> {
    const vendor = await this.getVendorProfile(vendorId);
    if (!vendor) return;

    // Simple moving average update (in a real system, this would be more sophisticated)
    const newResponseTime = (vendor.response_time_avg_hours + negotiationResult.responseTimeHours) / 2;
    
    // Update success rate (simplified calculation)
    const weightedSuccessRate = negotiationResult.successful 
      ? Math.min(100, vendor.success_rate + 1)
      : Math.max(0, vendor.success_rate - 1);

    const { error } = await supabase
      .from('vendor_profiles')
      .update({
        response_time_avg_hours: Math.round(newResponseTime),
        success_rate: Number(weightedSuccessRate.toFixed(2)),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', vendorId);

    if (error) {
      console.error('Failed to update vendor performance:', error);
    }
  },

  async getRecommendedVendors(
    serviceType: string,
    location: string,
    limit: number = 5
  ): Promise<VendorMatch[]> {
    const matches = await this.findMatchingVendors(serviceType, location);
    return matches.slice(0, limit);
  },

  // PoC Helper: Get demo vendor ID by email
  async getDemoVendorId(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'vendor@demo.com')
        .single();
      
      if (error) {
        console.error('Error getting demo vendor ID:', error);
        return null;
      }
      
      return data?.id || null;
    } catch (error) {
      console.error('Error in getDemoVendorId:', error);
      return null;
    }
  }
};
