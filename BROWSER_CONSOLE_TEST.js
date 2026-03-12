// ============================================================================
// BROWSER CONSOLE DIAGNOSTIC TEST
// ============================================================================
// Copy and paste this entire code into your browser console (F12)
// It will test the Supabase connection and show you exactly what's wrong
// ============================================================================

(async function diagnoseSupabase() {
  console.log('🔍 Starting Supabase diagnostic...\n');
  
  // Test 1: Check environment variables
  console.log('1️⃣ Checking environment variables...');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL is missing!');
    console.error('   → Check your .env file');
    console.error('   → Restart your dev server');
    return;
  } else {
    console.log('✅ VITE_SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');
  }
  
  if (!supabaseKey) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is missing!');
    console.error('   → Check your .env file');
    console.error('   → Restart your dev server');
    return;
  } else {
    console.log('✅ VITE_SUPABASE_ANON_KEY: Found (length:', supabaseKey.length, ')');
  }
  
  // Test 2: Check Supabase client
  console.log('\n2️⃣ Checking Supabase client...');
  try {
    const { supabase } = await import('./src/lib/supabase.ts');
    console.log('✅ Supabase client imported successfully');
  } catch (error) {
    console.error('❌ Failed to import Supabase client:', error);
    return;
  }
  
  // Test 3: Test connection to Supabase
  console.log('\n3️⃣ Testing connection to Supabase...');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Connection to Supabase successful!');
      console.log('   Status:', response.status, response.statusText);
    } else {
      console.error('❌ Connection failed:', response.status, response.statusText);
      console.error('   Response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Network error connecting to Supabase:');
    console.error('   Error:', error.message);
    console.error('   Type:', error.constructor.name);
    if (error.message.includes('fetch')) {
      console.error('\n💡 This is a network error. Possible causes:');
      console.error('   → Supabase project is paused');
      console.error('   → Internet connection issue');
      console.error('   → CORS problem');
      console.error('   → Firewall blocking the request');
    }
    return;
  }
  
  // Test 4: Test topics query
  console.log('\n4️⃣ Testing topics query...');
  try {
    const { supabase } = await import('./src/lib/supabase.ts');
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Topics query failed:');
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Error details:', error);
      
      if (error.code === 'PGRST116') {
        console.error('\n💡 The topics table does not exist!');
        console.error('   → Run DIAGNOSE_AND_FIX.sql in Supabase SQL Editor');
      } else if (error.code === '42501' || error.message.includes('permission')) {
        console.error('\n💡 Permission denied - RLS policy issue!');
        console.error('   → Run DIAGNOSE_AND_FIX.sql to fix RLS policies');
      }
      return;
    }
    
    if (data) {
      console.log('✅ Topics query successful!');
      console.log('   Found', data.length, 'topics');
      if (data.length > 0) {
        console.log('   Sample topic:', data[0].name);
      } else {
        console.warn('   ⚠️ Topics table is empty!');
        console.warn('   → Run DIAGNOSE_AND_FIX.sql to insert topics');
      }
    }
  } catch (error) {
    console.error('❌ Error querying topics:', error);
    return;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Diagnostic complete!');
  console.log('='.repeat(50));
  console.log('\nIf you see errors above, follow the suggested fixes.');
  console.log('Otherwise, try refreshing the page with Ctrl+Shift+R');
})();

