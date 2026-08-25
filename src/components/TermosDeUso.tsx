import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PostNaMaoLogo } from './PostNaMaoLogo';

export function TermosDeUso() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <a href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o início
        </a>
        
        <div className="mb-10">
          <PostNaMaoLogo className="h-10 w-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Termos de Uso</h1>
          <p className="text-slate-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma PostNaMão, você concorda em cumprir e ficar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Descrição do Serviço</h2>
            <p>
              O PostNaMão fornece uma ferramenta web focada em automação de marketing para corretores de imóveis, 
              permitindo a criação rápida de artes, aplicação de selos, edição de imagens e geração de textos utilizando Inteligência Artificial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Contas de Usuário</h2>
            <p>
              Para acessar certos recursos da plataforma, você deve criar uma conta. 
              Você é responsável por manter a confidencialidade das credenciais de sua conta e por todas as atividades que ocorrem sob sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Assinaturas e Pagamentos</h2>
            <p>
              O PostNaMão oferece planos gratuitos com uso limitado e planos pagos (Pro) que desbloqueiam funcionalidades exclusivas e limites expandidos. 
              As cobranças são realizadas de forma recorrente. Você pode cancelar sua assinatura a qualquer momento. 
              Nenhum reembolso será concedido por períodos parciais utilizados, exceto nos casos previstos em lei ou promoções específicas (como garantias de devolução).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Propriedade Intelectual</h2>
            <p>
              Todos os direitos, títulos e interesses na plataforma, incluindo tecnologia, designs e logotipos, são de propriedade exclusiva do PostNaMão. 
              Você detém a propriedade do conteúdo que você insere, como imagens de imóveis, desde que possua o direito de utilizá-las.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Limitação de Responsabilidade</h2>
            <p>
              O PostNaMão é fornecido "como está". Não garantimos que a plataforma estará sempre livre de erros, atrasos ou imperfeições. 
              Em nenhuma hipótese o PostNaMão será responsável por lucros cessantes ou danos indiretos decorrentes do uso da ferramenta.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
