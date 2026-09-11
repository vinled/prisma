import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to add realtime listener to profiles table so when webhook updates it, the app updates automatically
    if filepath == "src/App.tsx":
        if "channel('custom-all-channel')" not in content:
            # Find the end of useEffect where auth state change is handled
            idx = content.find("return () => {")
            if idx != -1:
                realtime_code = """
    // Subscribe to realtime profile updates
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
                content = content[:idx] + realtime_code + content[idx:]
                content = content.replace("subscription.unsubscribe();", "subscription.unsubscribe();\n      supabase.removeChannel(profileSubscription);")

    with open(filepath, 'w') as f:
        f.write(content)

update_file('src/App.tsx')
