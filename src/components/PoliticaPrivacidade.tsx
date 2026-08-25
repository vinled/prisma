import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PostNaMaoLogo } from './PostNaMaoLogo';

export function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <a href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o início
        </a>
        
        <div className="mb-10">
          <PostNaMaoLogo className="h-10 w-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Política de Privacidade</h1>
          <p className="text-slate-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Informações que Coletamos</h2>
            <p>
              O PostNaMão coleta as informações que você nos fornece diretamente, como ao criar uma conta, inserir dados de contato, ou realizar pagamentos. 
              Isso inclui seu e-mail, senha criptografada e dados necessários para faturamento da assinatura. 
              Também coletamos os dados e arquivos (imagens) que você envia para gerar artes na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Como Usamos suas Informações</h2>
            <p>
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços.</li>
              <li>Processar pagamentos e gerenciar sua assinatura.</li>
              <li>Fornecer suporte ao cliente e responder a solicitações.</li>
              <li>Enviar avisos técnicos, atualizações, alertas de segurança e mensagens administrativas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Compartilhamento de Informações</h2>
            <p>
              O PostNaMão não vende, aluga ou compartilha suas informações pessoais com terceiros para fins de marketing direto. 
              Podemos compartilhar informações com prestadores de serviços de confiança (como plataformas de pagamento, serviços em nuvem ou provedores de IA) exclusivamente para operar e fornecer o nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso, perda, destruição ou alteração não autorizados. 
              Entretanto, nenhum sistema de segurança é impenetrável, e não podemos garantir segurança absoluta de seus dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Seus Direitos e Escolhas</h2>
            <p>
              Você pode acessar, corrigir ou excluir suas informações pessoais fazendo login na sua conta do PostNaMão e usando as ferramentas disponíveis no painel. 
              Você também pode entrar em contato com nossa equipe de suporte para solicitar o encerramento da conta e a remoção de seus dados do nosso sistema.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Alterações nesta Política</h2>
            <p>
              O PostNaMão pode atualizar esta Política de Privacidade periodicamente. 
              Se fizermos alterações materiais, notificaremos nossos usuários por e-mail ou por um aviso claro na plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
