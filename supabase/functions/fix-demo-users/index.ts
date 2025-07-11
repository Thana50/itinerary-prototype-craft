
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
    console.log('Starting comprehensive demo users cleanup and recreation...')
    
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

    // Step 1: Direct database cleanup using SQL to bypass corrupted auth.users scanning
    console.log('Step 1: Direct database cleanup...')
    
    try {
      // Clean up public.users first (no corruption issues here)
      for (const email of demoEmails) {
        const { error: publicDeleteError } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('email', email)
        
        if (publicDeleteError && publicDeleteError.code !== 'PGRST116') {
          console.error(`Error deleting from public.users for ${email}:`, publicDeleteError)
        } else {
          console.log(`Cleaned up public.users record for ${email}`)
        }
      }

      // Direct SQL cleanup of auth.users to bypass scanning issues
      console.log('Performing direct auth.users cleanup...')
      
      // Use raw SQL to delete corrupted auth users without scanning
      const { error: authCleanupError } = await supabaseAdmin.rpc('cleanup_demo_auth_users')
      
      if (authCleanupError) {
        console.log('RPC cleanup failed, trying alternative approach:', authCleanupError.message)
        
        // Alternative: Delete by email using SQL query that doesn't trigger the scan error
        for (const email of demoEmails) {
          try {
            const { error } = await supabaseAdmin
              .rpc('delete_auth_user_by_email', { user_email: email })
            
            if (error) {
              console.log(`Could not delete auth user ${email}:`, error.message)
            } else {
              console.log(`Successfully deleted auth user ${email}`)
            }
          } catch (err) {
            console.log(`Exception deleting auth user ${email}:`, err.message)
          }
        }
      }
      
    } catch (cleanupError) {
      console.log('Database cleanup encountered issues:', cleanupError.message)
      // Continue anyway - we'll try to create users
    }

    // Wait for cleanup to settle
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 2: Create fresh demo users using Auth Admin API
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
          
          // If user already exists, try to update them instead
          if (authError.message?.includes('already been registered')) {
            console.log(`User ${userData.email} already exists, attempting to update...`)
            
            // Try to find and update the existing user
            try {
              // Create the public.users record manually if trigger didn't work
              const { error: insertError } = await supabaseAdmin
                .from('users')
                .upsert({
                  id: authData?.user?.id || crypto.randomUUID(),
                  email: userData.email,
                  role: userData.user_metadata.role,
                  name: userData.user_metadata.name
                }, { onConflict: 'email' })
              
              if (insertError) {
                console.error(`Error upserting user profile for ${userData.email}:`, insertError)
                results.push({ 
                  email: userData.email, 
                  status: 'error', 
                  error: `Profile upsert failed: ${insertError.message}`
                })
              } else {
                results.push({ 
                  email: userData.email, 
                  status: 'updated',
                  message: 'User already existed, profile updated'
                })
              }
            } catch (upsertError) {
              console.error(`Exception during upsert for ${userData.email}:`, upsertError)
              results.push({ 
                email: userData.email, 
                status: 'error', 
                error: `Upsert exception: ${upsertError.message}`
              })
            }
            continue
          }
          
          results.push({ 
            email: userData.email, 
            status: 'error', 
            error: authError.message || 'Unknown auth error'
          })
          continue
        }

        if (!authData.user) {
          console.error(`No user data returned for ${userData.email}`)
          results.push({ 
            email: userData.email, 
            status: 'error', 
            error: 'No user data returned from auth creation'
          })
          continue
        }

        console.log(`Successfully created user: ${userData.email} with ID: ${authData.user.id}`)
        
        // Verify/create the public.users record manually (in case trigger didn't work)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: publicUser, error: publicSelectError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle()
        
        if (publicSelectError) {
          console.error(`Error checking public.users for ${userData.email}:`, publicSelectError)
        }
        
        if (!publicUser) {
          console.log(`Creating public.users record for ${userData.email}`)
          const { error: insertError } = await supabaseAdmin
            .from('users')
            .insert({
              id: authData.user.id,
              email: userData.email,
              role: userData.user_metadata.role,
              name: userData.user_metadata.name
            })
          
          if (insertError) {
            console.error(`Error creating public.users record for ${userData.email}:`, insertError)
          } else {
            console.log(`Successfully created public.users record for ${userData.email}`)
          }
        } else {
          console.log(`Public.users record already exists for ${userData.email}`)
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
          error: err.message || 'Exception occurred during user creation'
        })
      }
    }

    console.log('Demo users cleanup and recreation completed')
    console.log('Results:', results)
    
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
        error: error.message || 'Unknown error occurred',
        details: 'Check function logs for more details'
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
