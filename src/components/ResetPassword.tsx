import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PostNaMaoLogo } from './PostNaMaoLogo';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Listen for the auth state change when the recovery link is clicked
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // We are in recovery mode, the user can now set a new password
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Senha atualizada com sucesso! Redirecionando...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
        <div className="flex justify-center mb-8">
          <div className="flex justify-center items-center mb-6"><PostNaMaoLogo className="h-16 w-auto" /></div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Definir nova senha
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

        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : 'Atualizar senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
