const fs = require('fs');

let code = `import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PrismaLogo } from './PrismaLogo';

export function Auth() {
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage('Verifique seu email para confirmar o cadastro (ou faça login se configurado sem confirmação).');
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (!email) {
      setError('Por favor, insira seu email.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, { 
      redirectTo: \`\${window.location.origin}/reset-password\` 
    });
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Link de recuperação enviado! Verifique sua caixa de entrada.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
        <div className="flex justify-center mb-8">
          <PrismaLogo />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          {isRecovery ? 'Recuperar senha' : 'Acesse sua conta'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center transition-colors">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm text-center transition-colors">
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          {!isRecovery && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecovery(true);
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-2">
            {isRecovery ? (
              <>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Aguarde...' : 'Enviar link de recuperação'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecovery(false);
                    setError(null);
                    setMessage(null);
                  }}
                  className="w-full text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Voltar ao login
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Aguarde...' : 'Entrar'}
                </button>
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Auth.tsx', code);
