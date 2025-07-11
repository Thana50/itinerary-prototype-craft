
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
    console.log('Starting demo users cleanup and recreation...')
    
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

    const demoEmails = ['agent@demo.com', 'traveler@demo.com', 'vendor@demo.com']
    const results = []

    // Step 1: Clean up existing users
    console.log('Step 1: Cleaning up existing demo users...')
    for (const email of demoEmails) {
      try {
        // Get user by email first
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000
        })
        
        if (listError) {
          console.error(`Error listing users:`, listError)
          continue
        }

        const existingUser = users.users.find(u => u.email === email)
        if (existingUser) {
          console.log(`Found existing user ${email}, deleting...`)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
          if (deleteError) {
            console.error(`Error deleting user ${email}:`, deleteError)
          } else {
            console.log(`Successfully deleted user ${email}`)
          }
        }
      } catch (err) {
        console.error(`Exception while cleaning up ${email}:`, err)
      }
    }

    // Wait a moment for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Step 2: Create fresh demo users
    console.log('Step 2: Creating fresh demo users...')
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

    for (const userData of demoUsers) {
      try {
        console.log(`Creating fresh user: ${userData.email}`)
        
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: userData.user_metadata
        })

        if (authError) {
          console.error(`Failed to create user ${userData.email}:`, authError)
          results.push({ 
            email: userData.email, 
            status: 'error', 
            error: authError.message || 'Unknown error'
          })
          continue
        }

        if (!authData.user) {
          console.error(`No user data returned for ${userData.email}`)
          results.push({ 
            email: userData.email, 
            status: 'error', 
            error: 'No user data returned'
          })
          continue
        }

        console.log(`Successfully created user: ${userData.email} with ID: ${authData.user.id}`)
        
        // Verify the user was created in public.users table (should be handled by trigger)
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait for trigger
        
        const { data: publicUser, error: publicError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()
        
        if (publicError) {
          console.log(`User ${userData.email} not yet in public.users, this is expected if trigger is working`)
        } else {
          console.log(`User ${userData.email} found in public.users:`, publicUser)
        }

        results.push({ 
          email: userData.email, 
          status: 'created',
          id: authData.user.id,
          confirmed: authData.user.email_confirmed_at ? true : false
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

    console.log('Demo users cleanup and recreation completed')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo users cleanup and recreation completed',
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
    console.error('Error in fix-demo-users function:', error)
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
