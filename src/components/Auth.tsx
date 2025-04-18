import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserIcon, LockIcon, ArrowRightIcon } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const email = `${username}@user.com`;
      const { error } = await (mode === 'signin' 
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password }));
      
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Freelance PM</h1>
          <h2 className="text-2xl font-semibold text-white/90">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="mt-2 text-white/70">
            {mode === 'signin' 
              ? 'Sign in to manage your projects'
              : 'Get started with project management'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-xl ring-1 ring-white/20 sm:rounded-lg sm:px-10">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-white/40" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full pl-10 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-white/40" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
              >
                {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-sm text-white/70 hover:text-white"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}