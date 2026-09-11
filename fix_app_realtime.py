import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the bad realtime code block
bad_code = """    // Subscribe to realtime profile updates
    const profileSubscription = supabase
      .channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session?.user.id}` },
        (payload) => {
          if (payload.new && payload.new.plan) {
            setUserPlan(payload.new.plan);
            alert("Pagamento confirmado! Seu plano PRO foi ativado com sucesso. Aproveite!");
          }
        }
      )
      .subscribe();

"""
content = content.replace(bad_code, "")

# Find the end of the auth useEffect
auth_end_bad = """    return () => subscription.unsubscribe();
      supabase.removeChannel(profileSubscription);
  }, []);"""

auth_end_good = """    // Subscribe to realtime profile updates if logged in
    let profileSubscription: any = null;
    if (session?.user?.id) {
      profileSubscription = supabase
        .channel(`profile-updates-${session.user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
          (payload) => {
            if (payload.new && payload.new.plan) {
              setUserPlan(payload.new.plan);
              alert("Pagamento confirmado! Seu plano PRO foi ativado com sucesso. Aproveite!");
            }
          }
        )
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) supabase.removeChannel(profileSubscription);
    };
  }, [session?.user?.id]);"""

# Oh wait, session is part of the state in App.tsx. It's fetched in `checkSession` and `onAuthStateChange`.
# So the dependency array of the auth useEffect is `[]`.
# Let's write it differently. I'll just write a new useEffect specifically for the realtime channel.
