// api/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv')
dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;  
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('supabaseServiceKey',supabaseServiceKey);
console.log('supabaseUrl',supabaseUrl);

// Client for regular operations (with RLS)
// exports.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
exports.supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});