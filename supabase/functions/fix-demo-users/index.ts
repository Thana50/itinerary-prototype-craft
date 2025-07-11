
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

    console.log('Starting demo users check...')

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

    // Check auth schema health using our custom function
    const { data: healthData, error: healthError } = await supabaseClient
      .rpc('check_auth_schema_health')

    if (healthError) {
      console.error('Error checking auth health:', healthError)
    } else {
      console.log('Auth schema health:', healthData)
    }

    // Log the current state
    const { error: logError } = await supabaseClient
      .from('auth_schema_fixes')
      .insert({
        operation: 'HEALTH_CHECK',
        table_name: 'public.users',
        column_name: 'email',
        description: `Found ${publicUsers?.length || 0} demo users in public.users table`,
        affected_rows: publicUsers?.length || 0,
        status: 'COMPLETED'
      })

    if (logError) {
      console.error('Error logging health check:', logError)
    }

    // Try to authenticate with demo credentials to test the auth flow
    let authTestResults = []
    
    for (const email of ['agent@demo.com', 'traveler@demo.com', 'vendor@demo.com']) {
      try {
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
          email,
          password: 'demo123'
        })
        
        if (authError) {
          console.error(`Auth test failed for ${email}:`, authError)
          authTestResults.push({
            email,
            status: 'FAILED',
            error: authError.message
          })
        } else {
          console.log(`Auth test succeeded for ${email}`)
          authTestResults.push({
            email,
            status: 'SUCCESS',
            user_id: authData.user?.id
          })
          
          // Sign out immediately
          await supabaseClient.auth.signOut()
        }
      } catch (error) {
        console.error(`Auth test exception for ${email}:`, error)
        authTestResults.push({
          email,
          status: 'EXCEPTION',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Demo users debug completed',
        publicUsers: publicUsers?.length || 0,
        authHealth: healthData || null,
        authTestResults,
        details: {
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
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
