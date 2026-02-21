// Lovable Cloud Function: admin-login
// Validates admin credentials without exposing the admin_users table to the browser.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

    if (!email || !password) {
      return new Response(JSON.stringify({ ok: false, error: "missing_credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceKey) {
      return new Response(JSON.stringify({ ok: false, error: "server_misconfigured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await admin
      .from("admin_users")
      .select("id,email,password_hash")
      .eq("email", String(email).trim())
      .maybeSingle();

    if (error || !data) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_credentials" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // NOTE: password_hash is currently stored as plain text in DB.
    // We keep this behavior to match the existing data, but recommend migrating to real hashing.
    const ok = String(password) === String(data.password_hash);

    return new Response(JSON.stringify({ ok, adminId: ok ? data.id : null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (_e) {
    return new Response(JSON.stringify({ ok: false, error: "unexpected" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
