import re

with open('src/components/MyAccount.tsx', 'r') as f:
    content = f.read()

# I will find the spot after `const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);`
idx = content.find("const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);")
if idx != -1:
    end_idx = idx + len("const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);")
    cancel_func = """
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar sua assinatura Pro? Você perderá o acesso aos benefícios imediatamente ou no final do ciclo.')) {
      return;
    }
    
    setIsCanceling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao cancelar assinatura');
      }
      
      alert('Assinatura cancelada com sucesso. Seu plano foi alterado para Grátis.');
      // A atualização em tempo real do banco de dados (que fizemos antes) já deve mudar a tela automaticamente.
    } catch (error: any) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsCanceling(false);
    }
  };
"""
    content = content[:end_idx] + cancel_func + content[end_idx:]

with open('src/components/MyAccount.tsx', 'w') as f:
    f.write(content)
