import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_effect = """  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);"""

new_effect = """  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);"""

content = content.replace(old_effect, new_effect)

with open('src/App.tsx', 'w') as f:
    f.write(content)
