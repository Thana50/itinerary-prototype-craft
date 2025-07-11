
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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the demo users
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
      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          user_metadata: userData.user_metadata,
          email_confirm: true
        })
        
        if (error) {
          console.log(`User ${userData.email} might already exist:`, error.message)
          results.push({ email: userData.email, status: 'exists_or_error', error: error.message })
        } else {
          console.log(`Created user: ${userData.email}`)
          results.push({ email: userData.email, status: 'created', id: data.user?.id })
        }
      } catch (err) {
        console.error(`Error creating ${userData.email}:`, err)
        results.push({ email: userData.email, status: 'error', error: err.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo users creation process completed',
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
