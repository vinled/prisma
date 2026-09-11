import re

with open('src/components/MyAccount.tsx', 'r') as f:
    content = f.read()

# Add handleCancelSubscription state and function
state_block = """  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);"""

cancel_func = """  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
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
  };"""

content = content.replace(state_block, cancel_func)

# Modify button in Pro plan
btn_block = """          <button 
            onClick={() => setIsCheckoutModalOpen(true)}
            disabled={isCheckoutLoading}
            className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
          >
            {isCheckoutLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Assinar Plano Pro"
            )}
          </button>"""

new_btn_block = """          {userPlan === 'pro' ? (
            <div className="flex flex-col space-y-3">
              <button 
                disabled
                className="w-full py-3 px-4 rounded-xl font-medium bg-emerald-600 text-white text-center shadow-lg shadow-emerald-600/20 cursor-default"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Plano Ativo
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="w-full py-2 px-4 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-sm"
              >
                {isCanceling ? 'Cancelando...' : 'Cancelar Assinatura'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsCheckoutModalOpen(true)}
              disabled={isCheckoutLoading}
              className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Assinar Plano Pro"
              )}
            </button>
          )}"""

content = content.replace(btn_block, new_btn_block)

with open('src/components/MyAccount.tsx', 'w') as f:
    f.write(content)

