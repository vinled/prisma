import React, { useState } from 'react';
import { handleCheckout } from '../utils/checkout';
import { Crown, Check , Loader2 } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Eleve o nível das suas captações
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mb-8">
            Assine o PostNaMão Pro para cadastrar imóveis ilimitados e desbloquear a Inteligência Artificial avançada.
          </p>
          
          <ul className="w-full space-y-3 mb-8 text-left">
            <li className="flex items-center text-gray-700 dark:text-zinc-300">
              <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
              <span className="font-medium">IAs Especializadas (Luxo, Investidor)</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-zinc-300">
              <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
              <span className="font-medium">Imóveis e Artes Ilimitadas</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-zinc-300">
              <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
              <span className="font-medium">Remoção da Marca d'água</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-zinc-300">
              <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
              <span className="font-medium">Brand Kit Automático</span>
            </li>
          </ul>

          <button
            onClick={() => handleCheckout(setIsCheckoutLoading)}
            disabled={isCheckoutLoading}
            className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl shadow-orange-600/25 mb-4"
          >
            {isCheckoutLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Desbloquear o PostNaMão Pro - R$ 49,90/mês"
            )}
          </button>

          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
