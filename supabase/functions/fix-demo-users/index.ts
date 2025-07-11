
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Starting demo users fix...')

    // Check auth.users table for demo users
    const { data: authUsers, error: authError } = await supabaseClient
      .from('auth.users')
      .select('*')
      .in('email', ['agent@demo.com', 'traveler@demo.com', 'vendor@demo.com'])

    if (authError) {
      console.error('Error fetching auth users:', authError)
      throw authError
    }

    console.log('Found auth users:', authUsers?.length || 0)

    // Check public.users table for demo users
    const { data: publicUsers, error: publicError } = await supabaseClient
      .from('users')
      .select('*')
      .in('email', ['agent@demo.com', 'traveler@demo.com', 'vendor@demo.com'])

    if (publicError) {
      console.error('Error fetching public users:', publicError)
      throw publicError
    }

    console.log('Found public users:', publicUsers?.length || 0)

    // Log the current state
    const { error: logError } = await supabaseClient
      .from('auth_schema_fixes')
      .insert({
        operation: 'HEALTH_CHECK',
        table_name: 'auth.users',
        column_name: 'confirmation_token',
        description: `Found ${authUsers?.length || 0} auth users and ${publicUsers?.length || 0} public users`,
        affected_rows: (authUsers?.length || 0) + (publicUsers?.length || 0),
        status: 'COMPLETED'
      })

    if (logError) {
      console.error('Error logging health check:', logError)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users check completed',
        authUsers: authUsers?.length || 0,
        publicUsers: publicUsers?.length || 0,
        details: {
          authUsers: authUsers || [],
          publicUsers: publicUsers || []
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in fix-demo-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
