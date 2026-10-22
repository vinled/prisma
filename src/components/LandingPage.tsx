import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ImagePlus, Instagram, LayoutTemplate, Download, Smartphone, Palette, Sparkles } from 'lucide-react';
import { PostNaMaoLogo } from './PostNaMaoLogo';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const steps = [
  { icon: ImagePlus, title: 'Adicione a foto e os dados', text: 'Use uma foto do seu imóvel. Informe preço, localização e as características que quer destacar.' },
  { icon: LayoutTemplate, title: 'Escolha o estilo e sua marca', text: 'Selecione um dos 6 estilos, aplique sua marca e ajuste o enquadramento da foto.' },
  { icon: Download, title: 'Baixe e publique', text: 'Exporte em PNG para Feed (4:5) ou Story (9:16). Depois, publique no Instagram ou compartilhe no WhatsApp.' },
];

const questions = [
  { title: 'O que posso fazer no plano gratuito?', answer: "Você pode salvar até 5 imóveis e gerar artes ilimitadas com a marca d'água PostNaMão. Também pode experimentar a geração de legendas com IA. Não é necessário informar cartão para criar a conta gratuita." },
  { title: 'Preciso instalar um aplicativo?', answer: 'Não. O PostNaMão funciona no navegador do celular ou do computador. Tenha uma foto do imóvel e os dados que deseja colocar na arte.' },
  { title: 'Posso colocar meu logo e meu contato?', answer: 'Sim. Em Minha Marca, cadastre seu logo, nome, CRECI e WhatsApp para usar nas artes. No plano gratuito, a marca d’água PostNaMão também aparece.' },
  { title: 'A ferramenta publica automaticamente no Instagram?', answer: 'Você baixa a arte em PNG e faz a publicação na sua rede social. O PostNaMão prepara a imagem e ajuda com a legenda; a publicação fica com você.' },
  { title: 'Como funciona o Plano Pro?', answer: 'O Pro custa R$ 49,90 por mês e permite criar artes sem marca d’água, salvar imóveis sem o limite do plano gratuito e acessar os recursos Pro de selos e IA. Crie sua conta e faça a assinatura dentro da ferramenta. A renovação pode ser cancelada em Minha Conta.' },
];

export function LandingPage({ onLoginClick, onSignUpClick }: LandingPageProps) {
  const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#F85818] px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#d9470e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#002040]';
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#002040]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:block focus:p-4">Ir para o conteúdo</a>
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <span aria-label="PostNaMão"><PostNaMaoLogo forceLight className="h-10 w-auto" /></span>
          <nav aria-label="Navegação principal" className="flex items-center gap-4 sm:gap-6">
            <a href="#como-funciona" className="hidden text-sm font-semibold hover:underline md:block">Como funciona</a>
            <a href="#planos" className="hidden text-sm font-semibold hover:underline md:block">Planos</a>
            <button onClick={onLoginClick} className="text-sm font-semibold hover:underline">Entrar</button>
            <button onClick={onSignUpClick} className="rounded-xl bg-[#F85818] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#d9470e]">Começar grátis</button>
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-[#FFF3EC] px-4 py-2 text-xs font-bold tracking-wide">FEITO PARA CORRETORES DE IMÓVEIS</p>
            <h1 className="max-w-xl text-[2.65rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">A foto do seu imóvel vira um <span className="text-[#F85818]">post pronto.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#667085]">Adicione a foto, preencha os dados e escolha um estilo. Baixe sua arte para Feed ou Story, com sua marca, pelo celular ou computador.</p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <button onClick={onSignUpClick} className={primaryButton}>Criar meu primeiro post grátis <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" /></button>
              <p className="max-w-md text-sm leading-relaxed text-[#667085]">Sem cartão. Até 5 imóveis salvos e artes ilimitadas com marca d'água.</p>
              <a href="#como-funciona" className="text-sm font-semibold underline underline-offset-4">Veja como funciona</a>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-md rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,43,0.10)] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold">
              <span>Seu imóvel, pronto para divulgar</span>
              <span className="rounded-full bg-[#FFF3EC] px-3 py-1.5">Exemplo de arte</span>
            </div>
            <img src="/depois.jpg" alt="Exemplo de arte com foto do imóvel, preço, localização e características organizados" width={1080} height={1080} fetchPriority="high" className="aspect-square w-full rounded-2xl object-contain" />
            <figcaption className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-[#667085]"><Check className="h-4 w-4 shrink-0 text-[#F85818]" aria-hidden="true" /> Exemplo ilustrativo. Você usa as fotos e os dados dos seus imóveis.</figcaption>
          </figure>
        </section>
        <section id="como-funciona" className="scroll-mt-6 border-y border-[#E5E7EB] bg-white px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-widest text-[#667085]">DA CAPTAÇÃO À DIVULGAÇÃO</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Seu primeiro post, em 3 etapas.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-7">
                  <div className="mb-7 flex items-center justify-between"><Icon className="h-7 w-7 text-[#F85818]" aria-hidden="true" /><span className="text-sm font-bold text-[#667085]">0{index + 1}</span></div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#667085]">{text}</p>
                </article>
              ))}
            </div>
            <button onClick={onSignUpClick} className={primaryButton + ' mt-8'}>Quero criar minha primeira arte <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </section>
        <section className="bg-[#0F172B] px-5 py-14 text-white sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Uma ferramenta para a sua rotina de corretor.</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                { icon: Smartphone, title: 'No celular ou computador', text: 'Prepare sua divulgação pelo navegador. Exporte a arte para Feed (4:5) ou Story (9:16).' },
                { icon: Palette, title: 'Com a sua identidade', text: 'Cadastre sua marca e escolha entre 6 estilos. Ajuste a foto, o contraste e os dados que aparecem na arte.' },
                { icon: Sparkles, title: 'Ajuda para escrever', text: 'Gere uma sugestão de legenda com IA usando os dados do imóvel. Revise o texto e adapte antes de publicar.' },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title}><Icon className="mb-5 h-7 w-7 text-[#F85818]" aria-hidden="true" /><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></article>
              ))}
            </div>
          </div>
        </section>
        <section id="planos" className="mx-auto max-w-5xl scroll-mt-6 px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Comece grátis.<br /><span className="text-[#667085]">Escolha o Pro quando precisar.</span></h2>
          <p className="mt-4 text-[#667085]">Experimente com um imóvel seu antes de decidir.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-[28px] border-2 border-[#F85818] bg-white p-7 sm:p-8">
              <p className="mb-4 text-xs font-bold tracking-wider">COMECE POR AQUI</p>
              <h3 className="text-xl font-bold">Gratuito</h3>
              <p className="mt-4 text-4xl font-extrabold">R$ 0</p>
              <p className="mt-2 text-sm text-[#667085]">Sem cartão para criar sua conta.</p>
              <ul className="my-7 flex-grow space-y-4 text-sm">
                {['Até 5 imóveis salvos', "Artes ilimitadas com marca d'água", 'Exportação para Feed e Story', 'Sua marca e seu contato nas artes', 'Teste da geração de legendas com IA'].map(item => <li key={item} className="flex items-start gap-3"><Check className="h-5 w-5 shrink-0 text-[#F85818]" aria-hidden="true" />{item}</li>)}
              </ul>
              <button onClick={onSignUpClick} className={primaryButton}>Começar com o gratuito</button>
            </article>
            <article className="flex flex-col rounded-[28px] border border-[#E5E7EB] bg-white p-7 sm:p-8">
              <p className="mb-4 text-xs font-bold tracking-wider text-[#667085]">PARA SUA ROTINA DE DIVULGAÇÃO</p>
              <h3 className="text-xl font-bold">Plano Pro</h3>
              <p className="mt-4 text-4xl font-extrabold">R$ 49,90 <span className="text-base font-medium text-[#667085]">/ mês</span></p>
              <p className="mt-2 text-sm text-[#667085]">Assine dentro da sua conta quando quiser.</p>
              <ul className="my-7 flex-grow space-y-4 text-sm">
                {['Imóveis e artes ilimitados', "Artes sem marca d'água", 'Recursos Pro de selos e IA', 'Suporte prioritário', 'Cancelamento da renovação em Minha Conta'].map(item => <li key={item} className="flex items-start gap-3"><Check className="h-5 w-5 shrink-0 text-[#F85818]" aria-hidden="true" />{item}</li>)}
              </ul>
              <button onClick={onSignUpClick} className="rounded-xl border border-[#002040] px-6 py-3.5 font-bold hover:bg-[#F8FAFC]">Criar conta e conhecer o Pro</button>
            </article>
          </div>
        </section>
        <section className="border-t border-[#E5E7EB] bg-white px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight">Antes do seu primeiro post</h2>
            <div className="space-y-3">
              {questions.map(({ title, answer }) => <details key={title} className="group rounded-2xl border border-[#E5E7EB] [&_summary::-webkit-details-marker]:hidden"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold">{title}<ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="px-5 pb-5 text-sm leading-relaxed text-[#667085]">{answer}</p></details>)}
            </div>
          </div>
        </section>
        <section className="px-5 py-14 text-center sm:px-8 sm:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight">Tem uma foto de imóvel no celular?</h2>
          <p className="mt-4 text-[#667085]">Use essa foto para criar seu primeiro post.</p>
          <button onClick={onSignUpClick} className={primaryButton + ' mt-7'}>Criar minha conta grátis <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
        </section>
      </main>
      <footer className="border-t border-[#E5E7EB] bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <p className="text-xs text-[#667085]">© {new Date().getFullYear()} PostNaMão. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#667085]">
            <a href="https://www.instagram.com/postnamaobr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline"><Instagram className="h-4 w-4" aria-hidden="true" /> Fale com a gente no Instagram</a>
            <Link to="/termos" className="hover:underline">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:underline">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
