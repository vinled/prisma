import React from 'react';
import { Smartphone, Tags, Zap, CheckCircle2, XCircle, Sparkles, Check, ShieldCheck, Star, ChevronDown, Home } from 'lucide-react';
import { PostNaMaoLogo } from './PostNaMaoLogo';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PostNaMaoLogo className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={onLoginClick}
              className="text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              Testar Grátis
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 text-orange-700 font-semibold text-sm shadow-sm">
              🔥 O Segredo dos Corretores Top Producers
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Suas Captações de Imóveis prontas para o <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">Instagram em 3 Segundos.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A primeira ferramenta de marketing exclusiva para corretores. Aplique selos de Vendido ou Exclusividade, ajuste o formato da fachada e gere textos com IA sem perder horas editando.
          </p>
          <div className="flex justify-center mb-16">
            <button 
              onClick={onLoginClick}
              className="text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1"
            >
              Criar meu primeiro post
            </button>
          </div>
          
          {/* App UI Placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent blur-3xl -z-10 rounded-full opacity-50"></div>
            <div className="bg-slate-900 rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border border-slate-800">
              <div className="bg-slate-800 rounded-2xl sm:rounded-[2rem] aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center relative overflow-hidden border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                   {/* Placeholder: Simulação de uma Fachada de Casa de Alto Padrão recebendo um selo de venda */}
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-full max-w-xs aspect-square bg-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {/* Mock de imagem de casa */}
                        <Home className="w-16 h-16 text-slate-500 opacity-50" />
                        {/* Mock do selo */}
                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full transform -rotate-12">
                           EXCLUSIVIDADE
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm">Preview: Fachada Alto Padrão + Selo</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Section */}
        <section className="py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              Do imóvel captado ao post publicado <br className="hidden sm:block"/> num estalar de dedos.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Antes */}
              <div className="bg-slate-800/50 border-2 border-slate-700 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 px-4 py-1.5 rounded-bl-2xl font-semibold text-sm">
                  Antes
                </div>
                <div className="flex-grow flex items-center justify-center bg-slate-800 rounded-xl mb-6 aspect-video border border-slate-700/50">
                  <XCircle className="w-16 h-16 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium text-lg text-center">
                  Horas no computador tentando ajustar a foto.
                </p>
              </div>

              {/* Depois */}
              <div className="bg-orange-500/10 border-2 border-orange-500 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-orange-500/20">
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1.5 rounded-bl-2xl font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Depois
                </div>
                <div className="flex-grow flex items-center justify-center bg-slate-800 rounded-xl mb-6 aspect-video border border-orange-500/30">
                  <PostNaMaoLogo className="h-16 w-auto" />
                </div>
                <p className="text-white font-medium text-lg text-center">
                  Imagem perfeita, com selo de Exclusividade e sua marca, direto no celular.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direto do Celular</h3>
              <p className="text-slate-600 leading-relaxed">
                Tirou a foto na visita? Crie a arte ali mesmo. Sem precisar de computador, Photoshop ou Canva.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Tags className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gatilhos de Venda</h3>
              <p className="text-slate-600 leading-relaxed">
                Aplique selos de "Exclusividade", "Oportunidade" e "Vendido" com apenas um toque na tela.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Focado em Vendas, Não em Design</h3>
              <p className="text-slate-600 leading-relaxed">
                Você precisa estar na rua fazendo visitas, não no computador alinhando textos. Interface pensada para a correria do corretor.
              </p>
            </div>
          </div>
        </section>

        {/* AI Copywriter Section */}
        <section className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-y border-slate-200">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
                <Sparkles className="w-4 h-4" /> IA Copywriter
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Não sabe o que escrever? A Inteligência Artificial faz isso por você.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                O PostNaMão não cria apenas a arte. Nossa IA analisa o seu imóvel e gera instantaneamente legendas magnéticas para o Instagram e mensagens persuasivas prontas para você disparar no WhatsApp dos seus clientes.
              </p>
            </div>
            <div className="relative">
               {/* Visual Chat Bubble Mockup */}
               <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-lg relative z-10">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                       <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Assistente IA</h4>
                      <p className="text-xs text-slate-500">Online agora</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-slate-700 text-sm leading-relaxed">
                    🏡 <strong>Mansão Suspensa com Vista Mar!</strong><br/><br/>
                    Acorde todos os dias com a brisa do mar. 4 suítes, varanda gourmet e acabamento em mármore.<br/><br/>
                    💎 <em>Oportunidade única para quem não abre mão do melhor.</em><br/><br/>
                    👉 Clique no link da bio e agende sua visita hoje mesmo!
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="bg-orange-500 text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm inline-block">
                      Perfeito! Vou enviar pro cliente. 🚀
                    </div>
                  </div>
               </div>
               {/* Decoration */}
               <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-50 z-0"></div>
               <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-slate-300 rounded-full blur-2xl opacity-50 z-0"></div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Escolha o plano ideal para alavancar suas captações
            </h2>
            <p className="text-lg text-slate-600">Sem surpresas, sem taxas ocultas. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gratuito</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">R$ 0</span>
                </div>
                <p className="text-slate-500 mt-2 text-sm">Para testar a ferramenta</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Acesso ao painel</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Geração de arte com marca d'água</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Teste da IA de textos</span>
                </li>
              </ul>
              <button 
                onClick={onLoginClick}
                className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Começar Grátis
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-900 rounded-3xl p-8 border-2 border-orange-500 shadow-xl shadow-orange-500/20 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-sm">
                MAIS ESCOLHIDO
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-xl font-bold text-white mb-2">Plano Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">R$ 49,90</span>
                  <span className="text-slate-400">/ mês</span>
                </div>
                <p className="text-slate-400 mt-2 text-sm">Tudo liberado para alta conversão</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span><strong className="text-white">Artes ilimitadas</strong></span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Sem marca d'água</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Selos exclusivos (Vendido, Oportunidade)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Copywriter de IA liberado</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-500 shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <a 
                href="https://www.asaas.com/c/j299iil4aqkray3j"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 text-center block"
              >
                Assinar o PostNaMão Pro
              </a>
            </div>
          </div>

          {/* Risk Reversal */}
          <div className="mt-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              <strong className="text-slate-900">Risco Zero.</strong> Teste o Plano Pro por 7 dias. Se não gostar, devolvemos 100% do seu dinheiro com um clique.
            </p>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                O que os corretores estão dizendo
              </h2>
              <p className="text-slate-400 text-lg">Junte-se a centenas de profissionais que já automatizaram seu marketing.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />)}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  "Parei de perder tempo no Canva. Clico num botão e a captação vai direto pro Instagram. Surreal."
                </p>
                <div>
                  <h4 className="font-bold text-white">Carlos E.</h4>
                  <p className="text-sm text-slate-500">Corretor Autônomo</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />)}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  "A IA que escreve as legendas já me salvou várias vezes. Mando direto pro WhatsApp do cliente."
                </p>
                <div>
                  <h4 className="font-bold text-white">Mariana T.</h4>
                  <p className="text-sm text-slate-500">Especialista em Alto Padrão</p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />)}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  "Colocar o selo de Vendido nunca foi tão fácil. Dá muita autoridade pro meu perfil."
                </p>
                <div>
                  <h4 className="font-bold text-white">Roberto F.</h4>
                  <p className="text-sm text-slate-500">Sócio de Imobiliária</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Perguntas Frequentes
              </h2>
            </div>
            
            <div className="space-y-4">
              <details className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                  Preciso instalar algum aplicativo?
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  Não, o PostNaMão funciona 100% no navegador do seu celular ou computador.
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                  Como funciona o limite do plano gratuito?
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  Você pode gerar até 10 artes por mês com a nossa marca d'água.
                </div>
              </details>

              <details className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                  Posso cancelar o Plano Pro quando quiser?
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  Sim, sem multas e sem burocracia, direto no painel.
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <PostNaMaoLogo className="h-8 w-auto grayscale opacity-50" />
            <span className="text-slate-500 font-medium text-sm">© 2026 PostNaMão. Todos os direitos reservados.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
