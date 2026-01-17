-- Travia MVP Database Schema - Helper Functions
-- Migration: 20260115000004
-- Description: Database functions for template matching, search, and analytics

-- ============================================================================
-- TEMPLATE MATCHING FUNCTIONS
-- ============================================================================

-- Function: Search templates by multiple criteria with ranking
CREATE OR REPLACE FUNCTION search_templates(
    p_destination TEXT DEFAULT NULL,
    p_category travel_category DEFAULT NULL,
    p_min_days INTEGER DEFAULT NULL,
    p_max_days INTEGER DEFAULT NULL,
    p_min_budget NUMERIC DEFAULT NULL,
    p_max_budget NUMERIC DEFAULT NULL,
    p_search_text TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    template_id UUID,
    name TEXT,
    description TEXT,
    category travel_category,
    duration_days INTEGER,
    estimated_cost JSONB,
    times_used INTEGER,
    success_rate NUMERIC,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        t.category,
        t.duration_days,
        t.estimated_cost,
        t.times_used,
        t.success_rate,
        -- Calculate relevance score
        (
            -- Exact category match
            CASE WHEN p_category IS NOT NULL AND t.category = p_category THEN 10 ELSE 0 END +
            -- Duration match
            CASE WHEN p_min_days IS NOT NULL AND t.duration_days >= p_min_days AND t.duration_days <= COALESCE(p_max_days, 999) THEN 8 ELSE 0 END +
            -- Text search relevance
            CASE WHEN p_search_text IS NOT NULL THEN 
                ts_rank(to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')), plainto_tsquery('english', p_search_text)) * 15
            ELSE 0 END +
            -- Success rate bonus
            (t.success_rate / 10) +
            -- Popularity bonus
            (LEAST(t.times_used, 100) / 10)
        ) AS relevance_score
    FROM templates t
    WHERE 
        t.is_active = TRUE
        AND (p_destination IS NULL OR EXISTS (
            SELECT 1 FROM destinations d 
            WHERE d.id = ANY(t.destination_ids) 
            AND d.name ILIKE '%' || p_destination || '%'
        ))
        AND (p_category IS NULL OR t.category = p_category)
        AND (p_min_days IS NULL OR t.duration_days >= p_min_days)
        AND (p_max_days IS NULL OR t.duration_days <= p_max_days)
        AND (p_min_budget IS NULL OR (t.estimated_cost->>'min')::NUMERIC >= p_min_budget)
        AND (p_max_budget IS NULL OR (t.estimated_cost->>'max')::NUMERIC <= p_max_budget)
        AND (p_search_text IS NULL OR to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', p_search_text))
    ORDER BY relevance_score DESC, t.times_used DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get recommended templates based on customer preferences
CREATE OR REPLACE FUNCTION get_template_recommendations(
    p_customer_id UUID,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    template_id UUID,
    template_name TEXT,
    match_score NUMERIC,
    match_reasons TEXT[]
) AS $$
DECLARE
    v_preferences JSONB;
    v_budget_range JSONB;
    v_travel_history JSONB;
BEGIN
    -- Get customer preferences
    SELECT travel_preferences, travel_history 
    INTO v_preferences, v_travel_history
    FROM customers 
    WHERE id = p_customer_id;
    
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        (
            -- Budget match (assuming preferences has budget_min and budget_max)
            CASE WHEN v_preferences ? 'budget_min' AND v_preferences ? 'budget_max' THEN
                CASE WHEN (t.estimated_cost->>'min')::NUMERIC >= (v_preferences->>'budget_min')::NUMERIC 
                     AND (t.estimated_cost->>'max')::NUMERIC <= (v_preferences->>'budget_max')::NUMERIC 
                THEN 20 ELSE 0 END
            ELSE 10 END +
            
            -- Category preference match
            CASE WHEN v_preferences ? 'preferred_categories' THEN
                CASE WHEN t.category::TEXT = ANY(ARRAY(SELECT jsonb_array_elements_text(v_preferences->'preferred_categories'))) 
                THEN 15 ELSE 0 END
            ELSE 5 END +
            
            -- Success rate
            t.success_rate / 2 +
            
            -- Popularity
            LEAST(t.times_used, 50) / 5
        ) AS match_score,
        
        -- Reasons array
        ARRAY[
            CASE WHEN t.success_rate > 80 THEN 'High success rate (' || t.success_rate || '%)' ELSE NULL END,
            CASE WHEN t.times_used > 20 THEN 'Popular template (used ' || t.times_used || ' times)' ELSE NULL END,
            CASE WHEN v_preferences ? 'preferred_categories' 
                AND t.category::TEXT = ANY(ARRAY(SELECT jsonb_array_elements_text(v_preferences->'preferred_categories')))
            THEN 'Matches your preferred style' ELSE NULL END,
            'Fits your budget'
        ]::TEXT[]
    FROM templates t
    WHERE t.is_active = TRUE
    ORDER BY match_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ANALYTICS FUNCTIONS
-- ============================================================================

-- Function: Calculate template performance metrics
CREATE OR REPLACE FUNCTION calculate_template_performance(
    p_template_id UUID,
    p_period_days INTEGER DEFAULT 90
)
RETURNS TABLE (
    total_uses INTEGER,
    conversion_rate NUMERIC,
    average_completion_time INTEGER,
    average_rating NUMERIC,
    average_customizations INTEGER,
    total_revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER AS total_uses,
        (COUNT(*) FILTER (WHERE conversion_to_booking = TRUE)::NUMERIC / NULLIF(COUNT(*), 0) * 100) AS conversion_rate,
        AVG(time_to_complete_minutes)::INTEGER AS average_completion_time,
        AVG(customer_rating) AS average_rating,
        AVG(customization_count)::INTEGER AS average_customizations,
        SUM(total_value) AS total_revenue
    FROM template_usage_analytics
    WHERE template_id = p_template_id
        AND created_at >= NOW() - (p_period_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get agent performance metrics
CREATE OR REPLACE FUNCTION get_agent_metrics(
    p_agent_id UUID,
    p_period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_itineraries INTEGER,
    confirmed_itineraries INTEGER,
    total_value NUMERIC,
    average_completion_time INTEGER,
    templates_used INTEGER,
    customers_served INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT i.id)::INTEGER AS total_itineraries,
        COUNT(DISTINCT i.id) FILTER (WHERE i.status IN ('confirmed', 'booked'))::INTEGER AS confirmed_itineraries,
        SUM(i.total_price) AS total_value,
        AVG(tua.time_to_complete_minutes)::INTEGER AS average_completion_time,
        COUNT(DISTINCT i.template_id)::INTEGER AS templates_used,
        COUNT(DISTINCT i.customer_id)::INTEGER AS customers_served
    FROM itineraries i
    LEFT JOIN template_usage_analytics tua ON tua.itinerary_id = i.id
    WHERE i.agent_id = p_agent_id
        AND i.created_at >= NOW() - (p_period_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ITINERARY HELPER FUNCTIONS
-- ============================================================================

-- Function: Generate unique share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..32 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Function: Calculate itinerary pricing
CREATE OR REPLACE FUNCTION calculate_itinerary_price(
    p_itinerary_data JSONB,
    p_number_of_travelers INTEGER
)
RETURNS JSONB AS $$
DECLARE
    v_total NUMERIC := 0;
    v_breakdown JSONB := '{}';
    v_day JSONB;
    v_activity JSONB;
BEGIN
    -- This is a simplified version - real implementation would be more complex
    FOR v_day IN SELECT * FROM jsonb_array_elements(p_itinerary_data->'days')
    LOOP
        FOR v_activity IN SELECT * FROM jsonb_array_elements(v_day->'activities')
        LOOP
            IF v_activity ? 'cost' AND (v_activity->>'cost')::NUMERIC > 0 THEN
                v_total := v_total + ((v_activity->>'cost')::NUMERIC * p_number_of_travelers);
            END IF;
        END LOOP;
    END LOOP;
    
    v_breakdown := jsonb_build_object(
        'base_price', v_total,
        'per_person', v_total / p_number_of_travelers,
        'currency', 'USD',
        'breakdown', jsonb_build_object(
            'activities', v_total * 0.4,
            'accommodations', v_total * 0.4,
            'meals', v_total * 0.15,
            'transportation', v_total * 0.05
        )
    );
    
    RETURN v_breakdown;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- DESTINATION SEARCH FUNCTIONS
-- ============================================================================

-- Function: Search destinations with filters
CREATE OR REPLACE FUNCTION search_destinations(
    p_search_text TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_halal_friendly BOOLEAN DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    destination_id UUID,
    name TEXT,
    country TEXT,
    description TEXT,
    tags TEXT[],
    match_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        d.country,
        d.description,
        d.tags,
        (
            CASE WHEN p_search_text IS NOT NULL THEN 
                ts_rank(to_tsvector('english', d.name || ' ' || COALESCE(d.description, '')), plainto_tsquery('english', p_search_text)) * 100
            ELSE 10 END +
            CASE WHEN p_tags IS NOT NULL AND d.tags && p_tags THEN 20 ELSE 0 END
        ) AS match_score
    FROM destinations d
    WHERE 
        d.is_active = TRUE
        AND (p_search_text IS NULL OR to_tsvector('english', d.name || ' ' || COALESCE(d.description, '')) @@ plainto_tsquery('english', p_search_text))
        AND (p_country IS NULL OR d.country ILIKE '%' || p_country || '%')
        AND (p_halal_friendly IS NULL OR d.halal_friendly = p_halal_friendly)
        AND (p_tags IS NULL OR d.tags && p_tags)
    ORDER BY match_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- NEGOTIATION HELPER FUNCTIONS
-- ============================================================================

-- Function: Get provider success rate
CREATE OR REPLACE FUNCTION get_provider_success_rate(
    p_provider_id UUID,
    p_period_days INTEGER DEFAULT 180
)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT 
            COALESCE(
                (COUNT(*) FILTER (WHERE status = 'accepted')::NUMERIC / NULLIF(COUNT(*), 0) * 100),
                0
            )
        FROM negotiations
        WHERE provider_id = p_provider_id
            AND created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION search_templates IS 'Search templates with multiple filters and relevance ranking';
COMMENT ON FUNCTION get_template_recommendations IS 'Get personalized template recommendations based on customer preferences';
COMMENT ON FUNCTION calculate_template_performance IS 'Calculate performance metrics for a template over a period';
COMMENT ON FUNCTION get_agent_metrics IS 'Get performance metrics for an agent';
COMMENT ON FUNCTION search_destinations IS 'Search destinations with filters and ranking';
COMMENT ON FUNCTION calculate_itinerary_price IS 'Calculate total pricing for an itinerary based on activities and travelers';
COMMENT ON FUNCTION get_provider_success_rate IS 'Calculate provider negotiation success rate';
