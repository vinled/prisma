import React, { useState } from 'react';
import { X, Loader2, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cpf: string) => void;
  isLoading: boolean;
}

export function CheckoutModal({ isOpen, onClose, onConfirm, isLoading }: CheckoutModalProps) {
  const [cpf, setCpf] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length < 11) {
      alert("Por favor, insira um CPF ou CNPJ válido.");
      return;
    }
    onConfirm(cleanCpf);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-orange-600 dark:text-orange-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Quase lá!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm">
            Para liberar os métodos de pagamento (Cartão de Crédito, Pix e Boleto), o gateway exige seu CPF ou CNPJ.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CPF / CNPJ
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Apenas números"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || cpf.length < 11}
              className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Continuar para Pagamento"
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Pagamento 100% seguro via Asaas.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
