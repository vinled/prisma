import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostNaMaoLogo } from './PostNaMaoLogo';

export function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o início
        </Link>
        
        <div className="mb-10">
          <PostNaMaoLogo className="h-10 w-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Política de Privacidade - PostNaMão</h1>
          <p className="text-slate-600">
            Bem-vindo ao PostNaMão. Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações.
          </p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed prose">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Dados Coletados</h2>
            <p>
              Coletamos seu nome, e-mail e os dados inseridos na aba 'Minha Marca' (como telefone, CRECI e logotipo) para o funcionamento exclusivo da geração de imagens e para comunicações da nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Dados Financeiros</h2>
            <p>
              Todo o processamento de pagamentos (PIX e Cartões) é realizado de forma terceirizada e segura pelo gateway Asaas. O PostNaMão não armazena dados sensíveis de cartão de crédito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Uso das Informações</h2>
            <p>
              Usamos seus dados para prestar o serviço de automação de imagens, melhorar nossa plataforma, fornecer suporte ao cliente e enviar comunicações de marketing relacionadas ao PostNaMão (que podem ser canceladas a qualquer momento).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Segurança</h2>
            <p>
              Seus dados são armazenados utilizando as melhores práticas de mercado (via Supabase), garantindo criptografia e segurança contra acessos não autorizados.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
