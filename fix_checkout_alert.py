import re
with open('src/utils/checkout.ts', 'r') as f:
    content = f.read()

correct_content = """import { supabase } from '../lib/supabase';

export async function handleCheckout(onLoading: (isLoading: boolean) => void) {
  try {
    onLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("Você precisa estar logado para assinar o plano.");
      return;
    }

    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Falha ao gerar cobrança");
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao gerar link de pagamento. Verifique as configurações do Asaas.");
    }
  } catch (error: any) {
    console.error("Checkout error:", error);
    alert(error.message || "Erro interno ao conectar com a API de pagamento. Verifique as configurações do servidor.");
  } finally {
    onLoading(false);
  }
}
"""

with open('src/utils/checkout.ts', 'w') as f:
    f.write(correct_content)
