import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Replace Hero Mockup
old_hero_mockup = r"\{\/\* App UI Placeholder \*\/\}.*?\{\/\* Before \& After Section \*\/\}"

new_hero_mockup = """{/* App UI Placeholder (Mobile First) */}
          <div className="relative mx-auto w-full max-w-md mt-12 mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>
            
            <div className="w-full max-w-[320px] aspect-[9/16] mx-auto bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Dynamic Island / Notch Placeholder */}
              <div className="absolute top-0 w-32 h-7 bg-slate-800 rounded-b-3xl z-20"></div>
              
              <div className="w-full h-full bg-slate-800 relative flex flex-col items-center justify-center p-6">
                {/* Mock de imagem de casa */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Home className="w-32 h-32 text-slate-600" />
                </div>
                
                {/* Mock do selo */}
                <div className="absolute top-12 left-6 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full transform -rotate-12 shadow-lg z-10 border border-orange-400/50">
                  EXCLUSIVIDADE
                </div>
                
                {/* Mock de Lower Third Glass Card */}
                <div className="absolute bottom-12 w-[90%] bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 z-10 shadow-xl flex flex-col gap-2">
                  <div className="w-3/4 h-6 bg-white/20 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="w-12 h-4 bg-white/10 rounded animate-pulse"></div>
                    <div className="w-12 h-4 bg-white/10 rounded animate-pulse"></div>
                  </div>
                  <div className="w-1/2 h-8 bg-white/20 rounded animate-pulse mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Sales Arguments) */}
        <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Ferramentas de alta conversão, <span className="text-orange-500">na palma da mão.</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-32 h-32 text-orange-500" />
                </div>
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
                  <Sparkles className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Design de Incorporadora</h3>
                <p className="text-slate-400 leading-relaxed">
                  Escolha entre 5 layouts exclusivos (Modern, Card Vidro, Premium Dark, Impacto e Clean). Artes validadas para vender imóveis de luxo, sem precisar entender de design.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                  <Smartphone className="w-32 h-32 text-orange-500" />
                </div>
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
                  <Smartphone className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Pronto para Todas as Telas</h3>
                <p className="text-slate-400 leading-relaxed">
                  Exporte sua arte perfeitamente enquadrada para o Feed (1:1) ou para estourar de visualizações nos Stories (9:16). Um clique, dois formatos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-32 h-32 text-orange-500" />
                </div>
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
                  <Zap className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Ajuste Fino Profissional</h3>
                <p className="text-slate-400 leading-relaxed">
                  Não fique engessado. Controle a altura e a cor do degradê, desloque a foto para o enquadramento perfeito e crie o post exatamente como você imaginou.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Section */}"""

content = re.sub(old_hero_mockup, new_hero_mockup, content, flags=re.DOTALL)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)

print("Updates applied to LandingPage")
