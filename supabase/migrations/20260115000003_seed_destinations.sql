-- Travia MVP Database Schema - Southeast Asian Destinations Seed Data
-- Migration: 20260115000003
-- Description: Populate destinations table with Southeast Asian locations
-- Source: Compiled from travel guides and requirements document

INSERT INTO destinations (name, country, region, description, coordinates, climate_info, best_visit_months, cultural_info, halal_friendly, visa_requirements, currency, language, timezone, average_temperature_range, popular_activities, tags) VALUES

-- ============================================================================
-- THAILAND
-- ============================================================================
(
    'Bangkok',
    'Thailand',
    'Central Thailand',
    'Thailand''s vibrant capital city, known for ornate shrines, bustling markets, and vibrant street life. A perfect blend of traditional and modern culture.',
    ST_GeogFromText('POINT(100.5018 13.7563)'),
    '{"type": "tropical_monsoon", "rainy_season": "May-October", "dry_season": "November-April"}'::jsonb,
    ARRAY[11, 12, 1, 2],
    '{"dress_code": "Modest clothing for temples", "customs": "Remove shoes before entering homes and temples", "religious_sites": "Extensive Buddhist temples", "language_tips": "English widely spoken in tourist areas"}'::jsonb,
    TRUE,
    '{"most_nationalities": "30-day visa on arrival or e-visa", "gcc_countries": "30-60 days visa-free"}'::jsonb,
    'THB',
    ARRAY['Thai', 'English'],
    'Asia/Bangkok',
    '{"hot": "27-35°C", "cool": "23-32°C"}'::jsonb,
    ARRAY['Temple visits', 'Street food tours', 'Floating markets', 'Shopping', 'River cruises', 'Night markets'],
    ARRAY['city', 'culture', 'food', 'shopping', 'temples', 'nightlife']
),
(
    'Phuket',
    'Thailand',
    'Southern Thailand',
    'Thailand''s largest island, famous for beautiful beaches, luxury resorts, and vibrant nightlife. Perfect for beach lovers and water sports enthusiasts.',
    ST_GeogFromText('POINT(98.3923 7.8804)'),
    '{"type": "tropical", "rainy_season": "May-October", "dry_season": "November-April"}'::jsonb,
    ARRAY[11, 12, 1, 2, 3],
    '{"dress_code": "Beach casual, modest for temples", "customs": "Respect Buddhist culture", "language_tips": "English widely spoken in tourist areas"}'::jsonb,
    TRUE,
    '{"most_nationalities": "30-day visa on arrival or e-visa"}'::jsonb,
    'THB',
    ARRAY['Thai', 'English'],
    'Asia/Bangkok',
    '{"year_round": "24-33°C"}'::jsonb,
    ARRAY['Beach activities', 'Island hopping', 'Snorkeling', 'Diving', 'Water sports', 'Spa & wellness'],
    ARRAY['beach', 'islands', 'water_sports', 'luxury', 'diving', 'family']
),
(
    'Chiang Mai',
    'Thailand',
    'Northern Thailand',
    'Cultural capital of Northern Thailand, surrounded by mountains and ancient temples. Known for traditional crafts, night markets, and proximity to hill tribes.',
    ST_GeogFromText('POINT(98.9817 18.7883)'),
    '{"type": "tropical_savanna", "cool_season": "November-February", "hot_season": "March-May", "rainy_season": "June-October"}'::jsonb,
    ARRAY[11, 12, 1, 2],
    '{"dress_code": "Casual, modest for temples", "customs": "Strong Buddhist traditions", "crafts": "Famous for handicrafts and textiles", "language_tips": "Less English than Bangkok"}'::jsonb,
    TRUE,
    '{"most_nationalities": "30-day visa on arrival or e-visa"}'::jsonb,
    'THB',
    ARRAY['Thai', 'Northern Thai', 'English'],
    'Asia/Bangkok',
    '{"cool": "15-28°C", "hot": "22-35°C"}'::jsonb,
    ARRAY['Temple visits', 'Cooking classes', 'Night markets', 'Elephant sanctuaries', 'Trekking', 'Handicraft shopping'],
    ARRAY['culture', 'temples', 'nature', 'adventure', 'crafts', 'food']
),

-- ============================================================================
-- MALAYSIA
-- ============================================================================
(
    'Kuala Lumpur',
    'Malaysia',
    'Federal Territory',
    'Malaysia''s modern capital featuring the iconic Petronas Twin Towers, diverse culture, excellent shopping, and world-class halal dining.',
    ST_GeogFromText('POINT(101.6869 3.1390)'),
    '{"type": "tropical_rainforest", "year_round_rain": true, "driest": "June-July"}'::jsonb,
    ARRAY[6, 7, 8],
    '{"dress_code": "Modest recommended, especially for religious sites", "religion": "Islamic majority, multicultural", "festivals": "Hari Raya, Chinese New Year, Deepavali", "language_tips": "English widely spoken"}'::jsonb,
    TRUE,
    '{"gcc_countries": "90 days visa-free", "most_western": "30-90 days visa-free"}'::jsonb,
    'MYR',
    ARRAY['Malay', 'English', 'Chinese', 'Tamil'],
    'Asia/Kuala_Lumpur',
    '{"year_round": "23-33°C"}'::jsonb,
    ARRAY['City tours', 'Shopping', 'Food tours', 'Cultural sites', 'Petronas Towers', 'Cave temples'],
    ARRAY['city', 'shopping', 'halal', 'culture', 'modern', 'food']
),
(
    'Langkawi',
    'Malaysia',
    'Kedah',
    'Tropical paradise archipelago with duty-free shopping, pristine beaches, and legendary folklore. Perfect for relaxation and island adventures.',
    ST_GeogFromText('POINT(99.8431 6.3500)'),
    '{"type": "tropical", "dry_season": "December-April", "monsoon": "September-November"}'::jsonb,
    ARRAY[12, 1, 2, 3, 4],
    '{"dress_code": "Beach casual, modest for mainland", "atmosphere": "Relaxed island life", "language_tips": "English widely spoken in resorts"}'::jsonb,
    TRUE,
    '{"same_as": "Malaysia entry requirements"}'::jsonb,
    'MYR',
    ARRAY['Malay', 'English'],
    'Asia/Kuala_Lumpur',
    '{"year_round": "25-32°C"}'::jsonb,
    ARRAY['Beach relaxation', 'Duty-free shopping', 'Cable car', 'Island hopping', 'Mangrove tours', 'Water sports'],
    ARRAY['beach', 'islands', 'duty_free', 'nature', 'relaxation', 'family']
),
(
    'Penang',
    'Malaysia',
    'Penang',
    'UNESCO World Heritage city of George Town, famous for street art, colonial architecture, and exceptional street food scene.',
    ST_GeogFromText('POINT(100.3327 5.4141)'),
    '{"type": "tropical", "year_round_warm": true, "wettest": "April-May, September-November"}'::jsonb,
    ARRAY[12, 1, 2, 3],
    '{"heritage": "UNESCO World Heritage George Town", "food": "Food capital of Malaysia", "art": "Famous street art murals", "language_tips": "English and Chinese widely spoken"}'::jsonb,
    TRUE,
    '{"same_as": "Malaysia entry requirements"}'::jsonb,
    'MYR',
    ARRAY['Malay', 'English', 'Chinese', 'Tamil'],
    'Asia/Kuala_Lumpur',
    '{"year_round": "24-32°C"}'::jsonb,
    ARRAY['Street food tours', 'Heritage walks', 'Street art', 'Temples', 'Beaches', 'Colonial architecture'],
    ARRAY['food', 'culture', 'heritage', 'art', 'city', 'halal']
),

-- ============================================================================
-- INDONESIA
-- ============================================================================
(
    'Bali',
    'Indonesia',
    'Bali',
    'Island of the Gods, famous for stunning beaches, terraced rice paddies, ancient temples, and vibrant arts scene. Perfect blend of culture and nature.',
    ST_GeogFromText('POINT(115.1889 -8.4095)'),
    '{"type": "tropical", "dry_season": "April-September", "wet_season": "October-March"}'::jsonb,
    ARRAY[4, 5, 6, 7, 8, 9],
    '{"religion": "Hindu majority (unique in Indonesia)", "dress_code": "Sarong required for temples", "offerings": "Daily offerings common sight", "language_tips": "English widely spoken in tourist areas"}'::jsonb,
    FALSE,
    '{"most_nationalities": "30-day visa-free or visa on arrival", "gcc_countries": "visa on arrival available"}'::jsonb,
    'IDR',
    ARRAY['Indonesian', 'Balinese', 'English'],
    'Asia/Makassar',
    '{"year_round": "24-31°C"}'::jsonb,
    ARRAY['Beach activities', 'Temple visits', 'Rice terraces', 'Surfing', 'Yoga & wellness', 'Cultural performances'],
    ARRAY['beach', 'culture', 'temples', 'nature', 'wellness', 'surfing']
),
(
    'Jakarta',
    'Indonesia',
    'Java',
    'Indonesia''s bustling capital, a mega-city showcasing modern Indonesia with excellent shopping, dining, and business facilities.',
    ST_GeogFromText('POINT(106.8650 -6.2088)'),
    '{"type": "tropical_monsoon", "dry_season": "June-September", "wet_season": "October-May"}'::jsonb,
    ARRAY[6, 7, 8],
    '{"population": "Over 10 million", "traffic": "Heavy traffic, plan accordingly", "language_tips": "English in business districts", "religion": "Muslim majority"}'::jsonb,
    TRUE,
    '{"most_nationalities": "30-day visa-free or visa on arrival"}'::jsonb,
    'IDR',
    ARRAY['Indonesian', 'English'],
    'Asia/Jakarta',
    '{"year_round": "24-33°C"}'::jsonb,
    ARRAY['Shopping malls', 'Museums', 'City tours', 'Dining', 'Historic sites', 'Business'],
    ARRAY['city', 'business', 'shopping', 'halal', 'modern']
),

-- ============================================================================
-- SINGAPORE
-- ============================================================================
(
    'Singapore',
    'Singapore',
    'Singapore',
    'Modern city-state, a global financial hub with futuristic architecture, world-class attractions, and exceptional multicultural dining scene.',
    ST_GeogFromText('POINT(103.8198 1.3521)'),
    '{"type": "tropical_rainforest", "year_round_warm_humid": true, "wettest": "November-January"}'::jsonb,
    ARRAY[2, 3, 4, 7, 8],
    '{"languages": "Multilingual (English, Mandarin, Malay, Tamil)", "laws": "Strict laws, respect regulations", "cleanliness": "Extremely clean city", "efficiency": "World-class public transport"}'::jsonb,
    TRUE,
    '{"gcc_countries": "30-90 days visa-free", "most_nationalities": "visa-free or easy e-visa"}'::jsonb,
    'SGD',
    ARRAY['English', 'Mandarin', 'Malay', 'Tamil'],
    'Asia/Singapore',
    '{"year_round": "24-32°C"}'::jsonb,
    ARRAY['Gardens by the Bay', 'Marina Bay', 'Shopping', 'Food courts', 'Sentosa Island', 'Zoo & wildlife', 'Universal Studios'],
    ARRAY['city', 'modern', 'family', 'shopping', 'halal', 'safe', 'luxury']
),

-- ============================================================================
-- VIETNAM
-- ============================================================================
(
    'Hanoi',
    'Vietnam',
    'Northern Vietnam',
    'Vietnam''s capital with over 1000 years of history, featuring French colonial architecture, vibrant street life, and rich cultural heritage.',
    ST_GeogFromText('POINT(105.8342 21.0278)'),
    '{"type": "humid_subtropical", "seasons": "distinct seasons", "best": "March-April, September-November"}'::jsonb,
    ARRAY[3, 4, 9, 10, 11],
    '{"heritage": "Old Quarter has 1000-year history", "coffee": "Famous for egg coffee", "language_tips": "Limited English, learn basic phrases", "traffic": "Chaotic motorcycle traffic"}'::jsonb,
    TRUE,
    '{"most_nationalities": "e-visa or visa on arrival available", "gcc_countries": "30-day visa-free for some"}'::jsonb,
    'VND',
    ARRAY['Vietnamese', 'English'],
    'Asia/Ho_Chi_Minh',
    '{"summer": "25-35°C", "winter": "15-20°C"}'::jsonb,
    ARRAY['Old Quarter walks', 'Street food tours', 'Halong Bay trips', 'Museums', 'Temple visits', 'Water puppet shows'],
    ARRAY['culture', 'history', 'food', 'city', 'heritage']
),
(
    'Ho Chi Minh City',
    'Vietnam',
    'Southern Vietnam',
    'Vietnam''s largest city, formerly Saigon, a dynamic metropolis blending French colonial heritage with modern Vietnamese energy.',
    ST_GeogFromText('POINT(106.6297 10.8231)'),
    '{"type": "tropical", "dry_season": "December-April", "wet_season": "May-November"}'::jsonb,
    ARRAY[12, 1, 2, 3, 4],
    '{"history": "Former Saigon, rich war history", "energy": "Fast-paced, entrepreneurial spirit", "language_tips": "More English than Hanoi", "shopping": "Excellent shopping and markets"}'::jsonb,
    TRUE,
    '{"same_as": "Vietnam entry requirements"}'::jsonb,
    'VND',
    ARRAY['Vietnamese', 'English'],
    'Asia/Ho_Chi_Minh',
    '{"year_round": "25-35°C"}'::jsonb,
    ARRAY['War museums', 'Cu Chi Tunnels', 'Mekong Delta tours', 'Street food', 'Shopping', 'Colonial architecture'],
    ARRAY['city', 'history', 'culture', 'food', 'shopping']
),

-- ============================================================================
-- PHILIPPINES
-- ============================================================================
(
    'Manila',
    'Philippines',
    'Luzon',
    'The Philippines'' capital, a sprawling metropolis with Spanish colonial history, vibrant nightlife, and gateway to Philippine islands.',
    ST_GeogFromText('POINT(120.9842 14.5995)'),
    '{"type": "tropical", "dry_season": "December-May", "wet_season": "June-November", "typhoons": "June-November"}'::jsonb,
    ARRAY[12, 1, 2, 3, 4],
    '{"religion": "Predominantly Catholic", "language_tips": "English widely spoken", "history": "Spanish and American colonial influence", "friendly": "Very hospitable people"}'::jsonb,
    FALSE,
    '{"most_nationalities": "30-day visa-free", "gcc_countries": "visa-free for tourism"}'::jsonb,
    'PHP',
    ARRAY['Filipino', 'English'],
    'Asia/Manila',
    '{"year_round": "25-32°C"}'::jsonb,
    ARRAY['Historic sites', 'Shopping malls', 'Nightlife', 'City tours', 'Museums', 'Food scene'],
    ARRAY['city', 'history', 'nightlife', 'shopping', 'English_speaking']
),
(
    'Boracay',
    'Philippines',
    'Visayas',
    'World-famous island paradise with powdery white sand beaches, crystal-clear waters, and vibrant party scene. Perfect beach destination.',
    ST_GeogFromText('POINT(121.9244 11.9674)'),
    '{"type": "tropical", "best_season": "November-May", "avoid": "June-October (rainy/typhoon)"}'::jsonb,
    ARRAY[11, 12, 1, 2, 3, 4, 5],
    '{"atmosphere": "Laid-back beach paradise", "activities": "Water sports hub", "nightlife": "Vibrant beach parties", "language_tips": "English widely spoken"}'::jsonb,
    FALSE,
    '{"same_as": "Philippines entry requirements"}'::jsonb,
    'PHP',
    ARRAY['Filipino', 'English'],
    'Asia/Manila',
    '{"year_round": "25-32°C"}'::jsonb,
    ARRAY['Beach lounging', 'Water sports', 'Island hopping', 'Diving', 'Nightlife', 'Sailing'],
    ARRAY['beach', 'islands', 'water_sports', 'diving', 'party', 'paradise']
),

-- ============================================================================
-- CAMBODIA
-- ============================================================================
(
    'Siem Reap',
    'Cambodia',
    'Northwest Cambodia',
    'Gateway to the magnificent Angkor Wat temple complex, offering incredible ancient Khmer architecture and rich cultural experiences.',
    ST_GeogFromText('POINT(103.8563 13.3671)'),
    '{"type": "tropical", "dry_season": "November-April", "wet_season": "May-October"}'::jsonb,
    ARRAY[11, 12, 1, 2],
    '{"temples": "Home to Angkor Wat complex", "dress_code": "Modest for temples (shoulders and knees covered)", "sunrise": "Famous Angkor Wat sunrise", "language_tips": "English in tourist areas"}'::jsonb,
    TRUE,
    '{"most_nationalities": "e-visa or visa on arrival", "fee": "approximately $30 USD"}'::jsonb,
    'USD',
    ARRAY['Khmer', 'English'],
    'Asia/Phnom_Penh',
    '{"cool": "22-30°C", "hot": "25-35°C"}'::jsonb,
    ARRAY['Angkor Wat tours', 'Temple exploration', 'Apsara dance shows', 'Night markets', 'Floating villages', 'Cooking classes'],
    ARRAY['culture', 'temples', 'history', 'UNESCO', 'adventure']
);

-- ============================================================================
-- INDEXES UPDATE
-- ============================================================================

-- Reindex for performance after bulk insert
REINDEX TABLE destinations;

-- ============================================================================
-- STATISTICS
-- ============================================================================

-- Update statistics for query planner
ANALYZE destinations;
