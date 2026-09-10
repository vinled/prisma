import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostNaMaoLogo } from './PostNaMaoLogo';

export function TermosDeUso() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o início
        </Link>
        
        <div className="mb-10">
          <PostNaMaoLogo className="h-10 w-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Termos de Uso - PostNaMão</h1>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed prose">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Aceitação</h2>
            <p>
              Ao criar uma conta no PostNaMão, você concorda em cumprir estes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. O Serviço</h2>
            <p>
              O PostNaMão é uma ferramenta de design automatizado para o mercado imobiliário. O plano gratuito possui limitações de quantidade de imóveis, que podem ser removidas mediante assinatura do Plano Pro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Responsabilidade do Usuário</h2>
            <p>
              Você é o único responsável pelos direitos autorais das fotografias e logotipos que faz o upload na plataforma. O PostNaMão não se responsabiliza por imagens de terceiros utilizadas sem permissão pelos usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Cancelamento</h2>
            <p>
              Assinantes do Plano Pro podem cancelar a renovação automática a qualquer momento. O serviço continuará ativo até o fim do ciclo já pago.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
