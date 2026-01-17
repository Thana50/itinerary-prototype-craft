-- Travia MVP Database Schema - Core Tables
-- Migration: 20260115000001
-- Description: Create comprehensive database schema for Travia MVP
-- Phase: Foundation tables (users, agencies, customers, destinations)

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographical data

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User role enum already exists from previous migration (app_role)

CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'suspended', 'cancelled');
CREATE TYPE travel_category AS ENUM ('family', 'luxury', 'adventure', 'cultural', 'beach', 'budget', 'honeymoon', 'group');
CREATE TYPE activity_type AS ENUM ('sightseeing', 'dining', 'entertainment', 'transportation', 'accommodation', 'shopping', 'outdoor', 'adventure', 'cultural', 'relaxation');
CREATE TYPE accommodation_type AS ENUM ('hotel', 'resort', 'hostel', 'apartment', 'villa', 'guesthouse');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE itinerary_status AS ENUM ('draft', 'review', 'shared', 'modified', 'approved', 'confirmed', 'booked', 'cancelled');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'needs_revision');
CREATE TYPE provider_type AS ENUM ('hotel', 'tour_operator', 'transportation', 'restaurant', 'activity_provider', 'guide');
CREATE TYPE negotiation_status AS ENUM ('initiated', 'sent', 'pending_response', 'negotiating', 'accepted', 'rejected', 'expired', 'cancelled');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- 1. AGENCIES
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_registration TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    address JSONB DEFAULT '{}',
    subscription_tier subscription_tier DEFAULT 'starter',
    subscription_status subscription_status DEFAULT 'active',
    max_agents INTEGER DEFAULT 3,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS (Enhanced - add agency relationship)
ALTER TABLE users ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES agencies(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES users(id) NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    nationality TEXT,
    travel_preferences JSONB DEFAULT '{}',
    travel_history JSONB DEFAULT '[]',
    communication_preferences JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DESTINATIONS
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    description TEXT,
    coordinates GEOGRAPHY(POINT),
    climate_info JSONB DEFAULT '{}',
    best_visit_months INTEGER[],
    cultural_info JSONB DEFAULT '{}',
    halal_friendly BOOLEAN DEFAULT FALSE,
    visa_requirements JSONB DEFAULT '{}',
    currency TEXT,
    language TEXT[],
    timezone TEXT,
    average_temperature_range JSONB DEFAULT '{}',
    popular_activities TEXT[],
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEMPLATE SYSTEM TABLES
-- ============================================================================

-- 5. TEMPLATES
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    destination_ids UUID[] NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    category travel_category NOT NULL,
    travel_type TEXT[] DEFAULT '{}',
    budget_range JSONB NOT NULL,
    estimated_cost JSONB NOT NULL,
    preview_image_url TEXT,
    preview_description TEXT,
    tags TEXT[],
    
    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    agency_id UUID REFERENCES agencies(id),
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Version control
    version INTEGER DEFAULT 1,
    parent_template_id UUID REFERENCES templates(id),
    
    -- Analytics
    times_used INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 0.00,
    average_rating NUMERIC(3,2) DEFAULT 0.00,
    last_used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEMPLATE_ACTIVITIES
CREATE TABLE template_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    sequence_order INTEGER NOT NULL,
    time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night', 'full_day')),
    start_time TIME,
    
    -- Activity details
    title TEXT NOT NULL,
    description TEXT,
    activity_type activity_type NOT NULL,
    duration_minutes INTEGER,
    location TEXT,
    coordinates GEOGRAPHY(POINT),
    
    -- Pricing
    estimated_cost JSONB DEFAULT '{}',
    
    -- Customization
    is_customizable BOOLEAN DEFAULT TRUE,
    is_optional BOOLEAN DEFAULT FALSE,
    alternatives JSONB DEFAULT '[]',
    
    -- Additional info
    booking_required BOOLEAN DEFAULT FALSE,
    advance_booking_days INTEGER,
    special_requirements TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(template_id, day_number, sequence_order)
);

-- 7. TEMPLATE_ACCOMMODATIONS
CREATE TABLE template_accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    check_in_day INTEGER NOT NULL,
    check_out_day INTEGER NOT NULL,
    
    -- Accommodation details
    name TEXT NOT NULL,
    type accommodation_type,
    location TEXT NOT NULL,
    coordinates GEOGRAPHY(POINT),
    rating_stars NUMERIC(2,1) CHECK (rating_stars >= 1 AND rating_stars <= 5),
    
    -- Room details
    room_type TEXT,
    max_occupancy INTEGER,
    amenities TEXT[],
    
    -- Pricing
    price_per_night JSONB NOT NULL,
    
    -- Customization
    is_customizable BOOLEAN DEFAULT TRUE,
    alternatives JSONB DEFAULT '[]',
    
    -- Additional info
    special_features TEXT[],
    halal_friendly BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEMPLATE_MEALS
CREATE TABLE template_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    meal_type meal_type NOT NULL,
    
    -- Meal details
    restaurant_name TEXT,
    cuisine_type TEXT,
    location TEXT,
    coordinates GEOGRAPHY(POINT),
    
    -- Pricing
    estimated_cost JSONB DEFAULT '{}',
    
    -- Dietary options
    is_halal_available BOOLEAN DEFAULT FALSE,
    is_vegetarian_available BOOLEAN DEFAULT FALSE,
    is_vegan_available BOOLEAN DEFAULT FALSE,
    
    -- Customization
    is_customizable BOOLEAN DEFAULT TRUE,
    is_included BOOLEAN DEFAULT TRUE,
    alternatives JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TEMPLATE_CUSTOMIZATION_RULES
CREATE TABLE template_customization_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('constraint', 'dependency', 'substitution', 'pricing_rule')),
    
    -- Rule definition
    applies_to TEXT NOT NULL,
    target_id UUID,
    day_number INTEGER,
    
    -- Rule logic
    rule_config JSONB NOT NULL,
    error_message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TEMPLATE_USAGE_ANALYTICS
CREATE TABLE template_usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    itinerary_id UUID, -- Forward reference, will be created later
    agent_id UUID REFERENCES users(id),
    
    -- Usage metrics
    customization_count INTEGER DEFAULT 0,
    time_to_complete_minutes INTEGER,
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT,
    
    -- Outcome
    status TEXT CHECK (status IN ('created', 'shared', 'approved', 'booked', 'cancelled', 'abandoned')),
    conversion_to_booking BOOLEAN DEFAULT FALSE,
    total_value NUMERIC(10,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ============================================================================
-- ITINERARY SYSTEM TABLES
-- ============================================================================

-- 11. ITINERARIES
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id),
    agent_id UUID REFERENCES users(id) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    
    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    destination_ids UUID[] NOT NULL,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    duration_days INTEGER NOT NULL,
    
    -- Travelers
    number_of_travelers INTEGER NOT NULL CHECK (number_of_travelers > 0),
    traveler_details JSONB DEFAULT '[]',
    
    -- Itinerary data (denormalized)
    itinerary_data JSONB NOT NULL,
    
    -- Pricing
    base_price NUMERIC(10,2),
    customization_adjustments NUMERIC(10,2) DEFAULT 0,
    total_price NUMERIC(10,2),
    currency TEXT DEFAULT 'USD',
    pricing_breakdown JSONB DEFAULT '{}',
    
    -- Status
    status itinerary_status DEFAULT 'draft',
    approval_status approval_status,
    
    -- Sharing
    shared_token TEXT UNIQUE,
    shared_at TIMESTAMPTZ,
    share_expires_at TIMESTAMPTZ,
    
    -- Metadata
    preferences TEXT,
    special_requests TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ
);

-- Add foreign key to template_usage_analytics now that itineraries exists
ALTER TABLE template_usage_analytics ADD CONSTRAINT fk_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE SET NULL;

-- 12. ITINERARY_CUSTOMIZATIONS
CREATE TABLE itinerary_customizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    made_by UUID REFERENCES users(id),
    
    -- Customization details
    customization_type TEXT NOT NULL CHECK (customization_type IN ('activity_added', 'activity_removed', 'activity_modified', 'accommodation_changed', 'meal_changed', 'date_changed', 'travelers_changed')),
    target_type TEXT NOT NULL,
    target_id TEXT,
    day_number INTEGER,
    
    -- Changes
    previous_value JSONB,
    new_value JSONB,
    
    -- Impact
    price_impact NUMERIC(10,2) DEFAULT 0,
    reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ITINERARY_SHARES
CREATE TABLE itinerary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES users(id) NOT NULL,
    shared_with_email TEXT NOT NULL,
    share_token TEXT UNIQUE NOT NULL,
    
    -- Access control
    access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment', 'edit')),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Tracking
    first_viewed_at TIMESTAMPTZ,
    last_viewed_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MODIFICATION_REQUESTS
CREATE TABLE modification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    
    -- Request details
    request_type TEXT CHECK (request_type IN ('change_activity', 'change_accommodation', 'change_dates', 'add_activity', 'remove_activity', 'budget_concern', 'other')),
    day_number INTEGER,
    target_id TEXT,
    
    -- Request content
    request_text TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Response
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'implemented')),
    agent_response TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CONVERSATION_HISTORY
CREATE TABLE conversation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) NOT NULL,
    user_role app_role NOT NULL,
    
    -- Message
    message_type TEXT CHECK (message_type IN ('text', 'template_suggestion', 'customization', 'pricing_update', 'system')),
    message_content TEXT NOT NULL,
    message_data JSONB DEFAULT '{}',
    
    -- AI context
    intent_detected TEXT,
    entities_extracted JSONB DEFAULT '{}',
    confidence_score NUMERIC(3,2),
    
    -- Conversation flow
    parent_message_id UUID REFERENCES conversation_history(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROVIDER & NEGOTIATION TABLES (Phase 2 Ready)
-- ============================================================================

-- 16. SERVICE_PROVIDERS
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type provider_type NOT NULL,
    
    -- Contact
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    contact_person TEXT,
    website TEXT,
    
    -- Location
    country TEXT NOT NULL,
    city TEXT,
    address TEXT,
    coordinates GEOGRAPHY(POINT),
    
    -- Service details
    service_categories TEXT[],
    geographical_coverage TEXT[],
    specializations TEXT[],
    
    -- Pricing model
    pricing_structure JSONB DEFAULT '{}',
    accepts_group_bookings BOOLEAN DEFAULT FALSE,
    minimum_booking_notice_days INTEGER,
    
    -- Business terms
    payment_terms TEXT,
    cancellation_policy TEXT,
    
    -- Relationship
    relationship_score NUMERIC(3,2) DEFAULT 0.00,
    preferred_provider BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PROVIDER_SERVICES
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    
    -- Service details
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    description TEXT,
    
    -- Availability
    available_from DATE,
    available_until DATE,
    seasonal_availability JSONB DEFAULT '{}',
    
    -- Capacity
    max_capacity INTEGER,
    min_group_size INTEGER,
    
    -- Pricing
    base_price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    price_per TEXT CHECK (price_per IN ('person', 'group', 'unit', 'hour', 'day')),
    volume_discounts JSONB DEFAULT '[]',
    
    -- Terms
    includes TEXT[],
    excludes TEXT[],
    requirements TEXT[],
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NEGOTIATIONS
CREATE TABLE negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID REFERENCES itineraries(id),
    agent_id UUID REFERENCES users(id) NOT NULL,
    provider_id UUID REFERENCES service_providers(id) NOT NULL,
    
    -- Negotiation details
    service_type TEXT NOT NULL,
    service_description TEXT NOT NULL,
    required_date DATE,
    quantity INTEGER,
    
    -- Pricing
    target_price NUMERIC(10,2),
    offered_price NUMERIC(10,2),
    final_price NUMERIC(10,2),
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status negotiation_status DEFAULT 'initiated',
    
    -- Timing
    response_deadline TIMESTAMPTZ,
    follow_up_count INTEGER DEFAULT 0,
    last_follow_up_at TIMESTAMPTZ,
    
    -- Outcome
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. NEGOTIATION_MESSAGES
CREATE TABLE negotiation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negotiation_id UUID REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('agent', 'provider', 'ai', 'system')),
    sender_id UUID REFERENCES users(id),
    
    -- Message
    message_type TEXT CHECK (message_type IN ('initial_request', 'response', 'counter_offer', 'question', 'acceptance', 'rejection', 'follow_up')),
    subject TEXT,
    body TEXT NOT NULL,
    
    -- AI generation
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_template_used TEXT,
    
    -- Communication channel
    channel TEXT CHECK (channel IN ('email', 'platform', 'phone', 'whatsapp')),
    channel_metadata JSONB DEFAULT '{}',
    
    -- Tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PROVIDER_PERFORMANCE
CREATE TABLE provider_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
    measured_period_start DATE NOT NULL,
    measured_period_end DATE NOT NULL,
    
    -- Performance metrics
    total_negotiations INTEGER DEFAULT 0,
    successful_negotiations INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2) DEFAULT 0.00,
    average_response_time_hours NUMERIC(6,2),
    average_discount_percentage NUMERIC(5,2),
    
    -- Reliability
    on_time_delivery_rate NUMERIC(5,2) DEFAULT 0.00,
    cancellation_rate NUMERIC(5,2) DEFAULT 0.00,
    customer_satisfaction_score NUMERIC(3,2),
    
    -- Business value
    total_bookings INTEGER DEFAULT 0,
    total_revenue NUMERIC(12,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users and authentication
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Agencies
CREATE INDEX idx_agencies_subscription_status ON agencies(subscription_status);

-- Customers
CREATE INDEX idx_customers_agent_id ON customers(agent_id);
CREATE INDEX idx_customers_email ON customers(email);

-- Destinations
CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_active ON destinations(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_destinations_coordinates ON destinations USING GIST(coordinates);
CREATE INDEX idx_destinations_search ON destinations USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Templates
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_destinations ON templates USING GIN(destination_ids);
CREATE INDEX idx_templates_created_by ON templates(created_by);
CREATE INDEX idx_templates_agency_id ON templates(agency_id);
CREATE INDEX idx_templates_active ON templates(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_templates_search ON templates USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Template activities
CREATE INDEX idx_template_activities_template_id ON template_activities(template_id);
CREATE INDEX idx_template_activities_day ON template_activities(template_id, day_number);

-- Template accommodations
CREATE INDEX idx_template_accommodations_template_id ON template_accommodations(template_id);

-- Template meals
CREATE INDEX idx_template_meals_template_id ON template_meals(template_id);

-- Itineraries
CREATE INDEX idx_itineraries_agent_id ON itineraries(agent_id);
CREATE INDEX idx_itineraries_customer_id ON itineraries(customer_id);
CREATE INDEX idx_itineraries_template_id ON itineraries(template_id);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_itineraries_shared_token ON itineraries(shared_token) WHERE shared_token IS NOT NULL;
CREATE INDEX idx_itineraries_dates ON itineraries(start_date, end_date);

-- Itinerary customizations
CREATE INDEX idx_itinerary_customizations_itinerary_id ON itinerary_customizations(itinerary_id);

-- Modification requests
CREATE INDEX idx_modification_requests_itinerary_id ON modification_requests(itinerary_id);
CREATE INDEX idx_modification_requests_status ON modification_requests(status);

-- Conversation history
CREATE INDEX idx_conversation_history_itinerary_id ON conversation_history(itinerary_id);
CREATE INDEX idx_conversation_history_user_id ON conversation_history(user_id);

-- Negotiations
CREATE INDEX idx_negotiations_agent_id ON negotiations(agent_id);
CREATE INDEX idx_negotiations_provider_id ON negotiations(provider_id);
CREATE INDEX idx_negotiations_status ON negotiations(status);
CREATE INDEX idx_negotiations_itinerary_id ON negotiations(itinerary_id);

-- Providers
CREATE INDEX idx_providers_type ON service_providers(type);
CREATE INDEX idx_providers_country ON service_providers(country);
CREATE INDEX idx_providers_active ON service_providers(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_activities_updated_at BEFORE UPDATE ON template_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_accommodations_updated_at BEFORE UPDATE ON template_accommodations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_template_meals_updated_at BEFORE UPDATE ON template_meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON provider_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_negotiations_updated_at BEFORE UPDATE ON negotiations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment template usage counter
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE templates 
    SET times_used = times_used + 1, 
        last_used_at = NOW() 
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_template_usage_trigger 
AFTER INSERT ON itineraries 
FOR EACH ROW 
WHEN (NEW.template_id IS NOT NULL)
EXECUTE FUNCTION increment_template_usage();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE agencies IS 'Travel agencies using the platform - multi-tenancy support';
COMMENT ON TABLE customers IS 'Traveler profiles managed by agents';
COMMENT ON TABLE destinations IS 'Southeast Asian destination database with comprehensive metadata';
COMMENT ON TABLE templates IS 'Reusable travel itinerary templates';
COMMENT ON TABLE template_activities IS 'Day-by-day activities within templates';
COMMENT ON TABLE template_accommodations IS 'Accommodation options in templates';
COMMENT ON TABLE template_meals IS 'Meal plans in templates';
COMMENT ON TABLE template_customization_rules IS 'Constraints and rules for template customization';
COMMENT ON TABLE itineraries IS 'Customer-specific itineraries based on templates';
COMMENT ON TABLE itinerary_customizations IS 'Track all modifications made to itineraries';
COMMENT ON TABLE conversation_history IS 'AI conversation logs for itinerary building';
COMMENT ON TABLE service_providers IS 'Provider directory for rate negotiations';
COMMENT ON TABLE negotiations IS 'Rate negotiation tracking';
