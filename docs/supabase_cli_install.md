# Supabase CLI Installation Guide (Windows)

## Option 1: Install via NPM (Recommended - Fastest)

If you have Node.js installed (which you do, since the project uses npm):

```powershell
npm install -g supabase
```

After installation:
```powershell
supabase --version
```

---

## Option 2: Install via Scoop

First install Scoop package manager:
```powershell
# Run in PowerShell (as user, NOT admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Then install Supabase CLI:
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## Option 3: Direct Binary Download

1. Download from: https://github.com/supabase/cli/releases
2. Choose `supabase_windows_amd64.zip`
3. Extract to a folder
4. Add to PATH environment variable

---

## Option 4: Test Migrations Manually (No CLI Required)

If you prefer not to install Supabase CLI right now, you can:

1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Run each migration file manually in order:
   - `20260115000001_create_comprehensive_schema.sql`
   - `20260115000002_rls_policies.sql`
   - `20260115000003_seed_destinations.sql`
   - `20260115000004_helper_functions.sql`

---

## Recommended: Option 1 (NPM)

Since your project already uses npm, this is the simplest and fastest option.

Would you like me to proceed with Option 1 (npm install)?
