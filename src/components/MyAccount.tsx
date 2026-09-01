import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Check, Star, Zap, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BrandKit } from '../types';

interface MyAccountProps {
  session: Session;
  brandKit?: BrandKit | null;
  userPlan?: "free" | "pro";
  creditsUsed: number;
}

export function MyAccount({ session, brandKit, userPlan = "free", creditsUsed }: MyAccountProps) {
  const currentPlan = userPlan === 'pro' ? 'Pro' : 'Grátis';
  const creditsTotal = 5;
  const progressPercent = Math.min((creditsUsed / creditsTotal) * 100, 100);
  
  // State for user name
  const [userName, setUserName] = useState(
    session.user.user_metadata?.full_name || 'Usuário'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [isSavingName, setIsSavingName] = useState(false);

  const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setIsSavingName(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName }
    });
    
    if (!error) {
      setUserName(newName);
      setIsEditingName(false);
    } else {
      alert('Erro ao atualizar nome: ' + error.message);
    }
    
    setIsSavingName(false);
  };

  const textoSuporte = encodeURIComponent(`Olá equipe do PostNaMão! Meu nome é ${userName} e preciso de ajuda com a minha assinatura.`);
  const whatsappLink = `https://wa.me/5513988806648?text=${textoSuporte}`;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minha Conta</h1>
        <p className="text-gray-500 dark:text-zinc-400">Gerencie sua assinatura e uso da plataforma.</p>
      </header>

      {/* Painel de Consumo */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda (Perfil Humanizado) */}
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 pb-6 md:pb-0 md:pr-6">
            <div className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-sm overflow-hidden relative">
              {brandKit?.logo ? (
                <img src={brandKit.logo} alt="Logo" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    placeholder="Seu nome"
                    autoFocus
                  />
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="px-2 py-1 text-[10px] font-bold text-white bg-emerald-600 rounded hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={() => setIsEditingName(false)}
                      disabled={isSavingName}
                      className="px-2 py-1 text-[10px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700 rounded hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{userName}</h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3 truncate">{session.user.email}</p>
                  <button 
                    onClick={() => {
                      setNewName(userName);
                      setIsEditingName(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Editar Dados
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Coluna Direita (Uso) */}
          <div className="flex flex-col justify-center space-y-5 md:pl-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-1">Plano atual</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300">
                  {currentPlan}
                </span>
              </div>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-1">Uso de imóveis</h2>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userPlan === 'pro' ? (
                      `${creditsUsed} imóveis cadastrados (Ilimitado)`
                    ) : (
                      `${creditsUsed} de ${creditsTotal} imóveis cadastrados`
                    )}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{userPlan === 'pro' ? '100%' : `${progressPercent.toFixed(0)}%`}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all" 
                  style={{ width: userPlan === 'pro' ? '100%' : `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Tabela de Preços */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Planos e Upgrade</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Plano Grátis */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plano Grátis</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ 0</span>
              <span className="text-gray-500 dark:text-zinc-400">/mês</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">10 artes gratuitas por mês</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">IA de legendas (Básica)</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">Marca d'água nas imagens</span>
            </li>
          </ul>
          
          <button 
            disabled 
            className="w-full py-3 px-4 rounded-xl font-medium bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
          >
            Plano Atual
          </button>
        </div>

        {/* Plano Pro */}
        <div className="bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-zinc-900 p-8 rounded-2xl shadow-sm border-2 border-orange-200 dark:border-orange-800 flex flex-col transition-colors duration-200 relative overflow-hidden">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">Plano Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ 49,90</span>
              <span className="text-gray-500 dark:text-zinc-400">/mês</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 shrink-0" />
              <span className="text-gray-900 dark:text-zinc-100 font-medium">Artes ilimitadas</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">IA de legendas Avançada (Gemini Luxo)</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">Brand Kit Global Automático</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3 shrink-0" />
              <span className="text-gray-600 dark:text-zinc-300">Sem marca d'água</span>
            </li>
          </ul>
          
          <a 
            href="https://www.asaas.com/c/j299iil4aqkray3j" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
          >
            Assinar Plano Pro
          </a>
        </div>
      </div>

      {/* Suporte */}
      <section className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Suporte e Ajuda</h3>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">Problemas com sua assinatura ou dúvidas sobre o PostNaMão?</p>
        </div>
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Falar com Suporte
        </a>
      </section>

    </div>
  );
}
