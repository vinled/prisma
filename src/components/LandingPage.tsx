import React from 'react';
import { Smartphone, Tags, Zap, CheckCircle2, XCircle } from 'lucide-react';
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Suas Captações Prontas para o <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">Instagram em 3 Segundos.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Esqueça horas editando fotos. O PostNaMão aplica selos de venda, ajusta o formato e entrega sua arte imobiliária pronta para atrair clientes de alto padrão.
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
                   <div className="flex flex-col items-center gap-4">
                     <PostNaMaoLogo className="h-20 w-auto opacity-50 grayscale" />
                     <p className="text-slate-500 font-medium">Interface do Aplicativo</p>
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Dificuldade</h3>
              <p className="text-slate-600 leading-relaxed">
                Interface intuitiva projetada especificamente para corretores. Você não precisa ser designer.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 border-t border-slate-200">
        <p>© 2026 PostNaMão. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
