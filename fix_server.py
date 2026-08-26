import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Update /api/generate-caption
old_generate = """      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ error: "Supabase config missing in server" });
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
            
      // Validate token
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
            
      if (authError || !user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      // Check user privileges (Pro Plan)
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();"""

new_generate = """      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
        return res.status(500).json({ error: "Supabase config missing in server" });
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
            
      // Validate token
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
            
      if (authError || !user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      // Check user privileges (Pro Plan) via Admin Bypass
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();"""

content = content.replace(old_generate, new_generate)

# 2. Update /api/webhook/asaas
old_webhook = """      const { event, payment } = req.body;
      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const userId = payment?.externalReference || payment?.customer;
                
        if (userId) {
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
                    
          if (!supabaseUrl || !supabaseServiceRole) {
            console.error("Supabase credentials missing for webhook");
            return res.status(500).json({ error: "Supabase config missing" });
          }
                    
          const supabase = createClient(supabaseUrl, supabaseServiceRole);
                    
          // Assuming 'profiles' table stores the plan
          const { error } = await supabase
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);
                      
          if (error) {
            console.error("Failed to update user plan:", error);
            throw error;
          }
          console.log(`User ${userId} upgraded to pro successfully.`);
        }
      }"""

new_webhook = """      const { event, payment } = req.body;
      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const customerEmail = payment?.customerEmail || payment?.email || req.body?.customerEmail;
        
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseServiceRole) {
          console.error("Supabase credentials missing for webhook");
          return res.status(500).json({ error: "Supabase config missing" });
        }
        
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
        
        let userId = payment?.externalReference;
        
        if (!userId && customerEmail) {
           // Search user by email using admin auth
           const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
           if (!usersError && usersData?.users) {
             const foundUser = usersData.users.find((u: any) => u.email === customerEmail);
             if (foundUser) {
               userId = foundUser.id;
             }
           }
        }
        
        if (userId) {
          // Assuming 'profiles' table stores the plan
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);
            
          if (error) {
            console.error("Failed to update user plan:", error);
            throw error;
          }
          console.log(`User ${userId} upgraded to pro successfully.`);
        } else {
           console.log(`Webhook: Could not find user ID for email: ${customerEmail}`);
        }
      }"""

content = content.replace(old_webhook, new_webhook)

with open('server.ts', 'w') as f:
    f.write(content)

print("Updates applied")
