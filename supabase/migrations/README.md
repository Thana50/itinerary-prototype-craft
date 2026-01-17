# Travia Database Migrations

This directory contains Supabase database migrations for the Travia MVP platform.

## Migration Files

### Core Schema
- **20260115000001_create_comprehensive_schema.sql** - Complete database schema with all tables, relationships, indexes, and triggers
- **20260115000002_rls_policies.sql** - Row Level Security policies for all tables
- **20260115000003_seed_destinations.sql** - Southeast Asian destinations seed data
- **20260115000004_helper_functions.sql** - Database functions for search, matching, and analytics

## Database Structure

The schema includes 20 tables organized into:

### Core Tables
- `agencies` - Travel agencies (multi-tenancy)
- `users` - User accounts (enhanced from base Supabase auth)
- `user_roles` - User role management
- `customers` - Traveler profiles

###Template System
- `destinations` - Southeast Asian destination database
- `templates` - Reusable itinerary templates
- `template_activities` - Day-by-day activities
- `template_accommodations` - Accommodation options
- `template_meals` - Meal plans
- `template_customization_rules` - Customization constraints
- `template_usage_analytics` - Template performance tracking

### Itinerary System
- `itineraries` - Customer-specific itineraries
- `itinerary_customizations` - Modification tracking
- `itinerary_shares` - Sharing mechanism
- `modification_requests` - Customer feedback
- `conversation_history` - AI conversation logs

### Provider & Negotiation System (Phase 2)
- `service_providers` - Provider directory
- `provider_services` - Service catalog
- `negotiations` - Rate negotiations
- `negotiation_messages` - Communication logs
- `provider_performance` - Performance metrics

## Running Migrations Locally

### Prerequisites
- Supabase CLI installed
- Local Supabase instance or connection to remote Supabase project

### Setup

1. **Initialize Supabase (if not already done)**
   ```bash
   supabase init
   ```

2. **Link to your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Apply all migrations**
   ```bash
   supabase db push
   ```

### Alternative: Manual Migration

If using Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run migration files in order:
   - Run `20260115000001_create_comprehensive_schema.sql`
   - Run `20260115000002_rls_policies.sql`
   - Run `20260115000003_seed_destinations.sql`
   - Run `20260115000004_helper_functions.sql`

## Testing Migrations

### Verify Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Verify RLS is Enabled
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Check Destination Data
```sql
SELECT name, country, tags 
FROM destinations 
WHERE is_active = TRUE;
```

### Test Template Search Function
```sql
SELECT * FROM search_templates(
    p_destination := 'Bangkok',
    p_category := 'cultural',
    p_min_days := 3,
    p_max_days := 7
);
```

## Important Notes

### PostGIS Extension
The schema uses PostGIS for geographical data (coordinates). Ensure it's enabled:
```sql
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### Service Role vs Anon Key
- RLS policies are designed for authenticated users
- Some operations (like analytics writes) should use service role
- Frontend should use anon key with JWT authentication

### Data Migration from Prototype
If you have existing data from the prototype:
1. Export existing user data
2. Map to new schema structure
3. Create custom migration for data transfer
4. Preserve user_roles relationships

## Schema Design Reference

See `docs/database_schema_design.md` for:
- Complete ERD diagram
- Table relationships
- Design decisions
- Future enhancements

## Security Considerations

- All tables have RLS enabled
- Policies enforce role-based access (agent, traveler, vendor)
- Sensitive provider data protected from public access
- Negotiation strategies hidden from vendors
- Customer data restricted to assigned agents

## Performance Optimizations

- Strategic indexes on foreign keys and search fields
- Full-text search indexes for templates and destinations
- GiST indexes for geographical queries
- Trigger-based timestamp updates
- Materialized views for analytics (future enhancement)

## Rollback

To rollback migrations:
```bash
supabase db reset
```

⚠️ **Warning**: This will delete all data!

For production, create specific rollback migrations.

## Next Steps

After running migrations:
1. Verify all tables created successfully
2. Test RLS policies with different user roles
3. Import additional destination data if needed
4. Configure Supabase auth settings
5. Set up backend API to connect to database
6. Create sample templates for testing

## Support

For questions about the schema:
- See `docs/database_schema_design.md`
- Check `implementation_plan.md` for context
- Review individual migration files for table-specific details
