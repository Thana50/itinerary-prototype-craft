
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating demo users...')
    
    // Create admin client using service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const demoUsers = [
      {
        email: 'agent@demo.com',
        password: 'demo123',
        user_metadata: {
          role: 'agent',
          name: 'Travel Agent Demo'
        }
      },
      {
        email: 'traveler@demo.com',
        password: 'demo123',
        user_metadata: {
          role: 'traveler',
          name: 'Traveler Demo'
        }
      },
      {
        email: 'vendor@demo.com',
        password: 'demo123',
        user_metadata: {
          role: 'vendor',
          name: 'Vendor Demo'
        }
      }
    ]

    const results = []
    
    for (const userData of demoUsers) {
      console.log(`Creating user: ${userData.email}`)
      
      try {
        // Try to create the user with email confirmation disabled
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // Auto-confirm email to avoid confirmation issues
          user_metadata: userData.user_metadata
        })

        if (authError) {
          // Check if it's a user already exists error
          if (authError.message.includes('already') || authError.code === 'user_already_exists') {
            console.log(`User ${userData.email} already exists, skipping...`)
            results.push({ email: userData.email, status: 'already_exists' })
          } else {
            console.error(`Failed to create user ${userData.email}:`, authError)
            results.push({ 
              email: userData.email, 
              status: 'error', 
              error: authError.message || 'Unknown error'
            })
          }
          continue
        }

        console.log(`Successfully created user: ${userData.email}`)
        results.push({ 
          email: userData.email, 
          status: 'created',
          id: authData.user?.id
        })

      } catch (err) {
        console.error(`Exception creating user ${userData.email}:`, err)
        results.push({ 
          email: userData.email, 
          status: 'error', 
          error: err.message || 'Exception occurred'
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo users creation process completed',
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in create-demo-users function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
