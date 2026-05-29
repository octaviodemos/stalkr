'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  analyze,
  useCredit,
  getCredits,
  isLoggedIn,
  type AnalyzeResult,
} from '@/lib/api';
import ResultsColumns from './ResultsColumns';
import NoCreditsModal from './NoCreditsModal';

export default function AnalyzeForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [showNoCredits, setShowNoCredits] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!username.trim()) {
      setError('Digite um username do Instagram');
      return;
    }

    if (!isLoggedIn()) {
      router.push('/register');
      return;
    }

    setLoading(true);

    try {
      const creditsBefore = await getCredits();

      if (!creditsBefore.unlimited && creditsBefore.credits < 1) {
        setShowNoCredits(true);
        setLoading(false);
        return;
      }

      await useCredit();
      const data = await analyze(username.trim());
      setResult(data);

      const creditsAfter = await getCredits();
      if (!creditsAfter.unlimited && creditsAfter.credits === 0) {
        setShowNoCredits(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao analisar';
      if (message.includes('No credits') || message.includes('402')) {
        setShowNoCredits(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full rounded-2xl border border-border bg-surface py-4 pl-9 pr-4 text-base outline-none ring-accent transition focus:ring-2"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? 'Analisando...' : 'Analisar agora'}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
      </form>

      {loading && (
        <div className="mt-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-lg text-zinc-400">Escaneando perfil...</p>
        </div>
      )}

      {result && !loading && (
        <div className="mt-12 w-full max-w-5xl px-4">
          <h2 className="mb-6 text-center text-xl font-bold">
            Quem <span className="text-accent">@{username.replace(/^@/, '')}</span> segue
          </h2>
          <ResultsColumns result={result} />
        </div>
      )}

      <NoCreditsModal open={showNoCredits} onClose={() => setShowNoCredits(false)} />
    </>
  );
}
