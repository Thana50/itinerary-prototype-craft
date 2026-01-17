# Manual Migration Testing Guide

Since Supabase CLI installation encountered issues, let's test the migrations manually via Supabase Dashboard.

## Steps to Test Migrations

### 1. Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your `itinerary-prototype-craft` project

### 2. Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **New query**

### 3. Run Migrations in Order

Copy and paste the contents of each file into the SQL Editor and run them **in this exact order**:

#### Migration 1: Core Schema
**File**: `supabase/migrations/20260115000001_create_comprehensive_schema.sql`

**What it does**: Creates all 20 tables, indexes, and triggers

**To run**:
1. Open the file in VS Code (already open in your editor)
2. Copy entire contents (Ctrl+A, Ctrl+C)
3. Paste into SQL Editor
4. Click **Run** button
5. ✅ Should see: "Success. No rows returned"

#### Migration 2: RLS Policies
**File**: `supabase/migrations/20260115000002_rls_policies.sql`

**What it does**: Enables Row Level Security and creates all policies

**To run**:
1. Open the file
2. Copy all contents
3. Paste into new SQL query
4. Click **Run**
5. ✅ Should see: "Success. No rows returned"

#### Migration 3: Destination Data
**File**: `supabase/migrations/20260115000003_seed_destinations.sql`

**What it does**: Inserts 13 Southeast Asian destinations

**To run**:
1. Open the file
2. Copy all contents
3. Paste into new SQL query
4. Click **Run**
5. ✅ Should see: "Success. 13 rows affected"

#### Migration 4: Helper Functions
**File**: `supabase/migrations/20260115000004_helper_functions.sql`

**What it does**: Creates search and analytics functions

**To run**:
1. Open the file
2. Copy all contents
3. Paste into new SQL query
4. Click **Run**
5. ✅ Should see: "Success. No rows returned"

### 4. Verify the Migrations

After running all 4 migrations, verify they worked:

#### Check Tables Created
Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

✅ **Expected**: Should see 20+ tables including:
- agencies, customers, destinations
- templates, template_activities, template_accommodations
- itineraries, itinerary_customizations
- service_providers, negotiations
- etc.

#### Check RLS is Enabled
Run this query:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

✅ **Expected**: All tables should have `rowsecurity = true`

#### Check Destination Data
Run this query:
```sql
SELECT name, country, halal_friendly, tags 
FROM destinations 
WHERE is_active = TRUE
ORDER BY country, name;
```

✅ **Expected**: Should see 13 destinations:
- Bangkok, Phuket, Chiang Mai (Thailand)
- Kuala Lumpur, Langkawi, Penang (Malaysia)
- Bali, Jakarta (Indonesia)
- Singapore
- Hanoi, Ho Chi Minh City (Vietnam)
- Manila, Boracay (Philippines)
- Siem Reap (Cambodia)

#### Test a Helper Function
Run this query:
```sql
SELECT * FROM search_destinations(
    p_search_text := 'beach',
    p_limit := 5
);
```

✅ **Expected**: Should return destinations with beach-related tags

### 5. Common Issues & Solutions

**Issue**: "extension postgis does not exist"
**Solution**: Run before Migration 1:
```sql
CREATE EXTENSION IF NOT EXISTS "postgis";
```

**Issue**: "relation already exists"
**Solution**: Migrations were already run. Check which step failed and continue from there.

**Issue**: "permission denied"
**Solution**: Make sure you're using Service Role key or have proper permissions

### 6. Once Verified

Once all migrations run successfully:
- ✅ Database schema is ready
- ✅ Security is in place
- ✅ Sample data loaded
- ✅ Helper functions available

You can then proceed to Stage 2: Backend API development!

## Need Help?

If you encounter any errors:
1. Copy the error message
2. Note which migration step failed
3. Share the error for troubleshooting
