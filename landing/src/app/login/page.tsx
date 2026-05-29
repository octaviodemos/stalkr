'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { login, saveToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token } = await login(email, password);
      saveToken(token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-sm px-4 py-12">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-zinc-400">Acesse sua conta Stalkr</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent py-3 font-semibold transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">
          Não tem conta?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
