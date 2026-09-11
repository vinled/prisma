with open('src/App.tsx', 'r') as f:
    content = f.read()

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

auth_end_bad = """    return () => subscription.unsubscribe();
      supabase.removeChannel(profileSubscription);
  }, []);"""

auth_end_good = """    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Separate useEffect for realtime profile updates
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channelName = `profile-updates-${session.user.id}-${Date.now()}`;
    const profileSubscription = supabase
      .channel(channelName)
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

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [session?.user?.id]);"""

content = content.replace(auth_end_bad, auth_end_good)

with open('src/App.tsx', 'w') as f:
    f.write(content)
