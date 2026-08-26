import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

fetch_data_logic = """
      if (session?.user) {
        // Load user plan and brand kit
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, brand_kit')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserPlan(profile.plan || 'free');
          if (profile.brand_kit) {
            setBrandKit(profile.brand_kit);
          }
        }

        // Load properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (propertiesData) {
          const loaded = propertiesData.map(p => ({
            id: p.id,
            date: p.date || new Date(p.created_at).toLocaleDateString('pt-BR'),
            details: p.details,
            selectedTemplate: p.selected_template,
            aspectRatio: p.aspect_ratio,
            templateOptions: p.template_options,
            thumbnail: p.thumbnail
          }));
          setSavedProperties(loaded);
        }
      }
"""

old_check_session = """  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    };
    checkSession();"""

new_check_session = """  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
""" + fetch_data_logic + """
    };
    checkSession();"""

content = content.replace(old_check_session, new_check_session)

old_auth_change = """    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    });"""

new_auth_change = """    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
""" + fetch_data_logic + """
    });"""

content = content.replace(old_auth_change, new_auth_change)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Success")
