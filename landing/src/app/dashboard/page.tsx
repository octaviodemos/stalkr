'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PricingSection from '@/components/PricingSection';
import {
  getCredits,
  getAnalysisHistory,
  clearToken,
  isLoggedIn,
  type AnalysisHistoryItem,
} from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [unlimited, setUnlimited] = useState(false);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    async function load() {
      try {
        const [creditsData, historyData] = await Promise.all([
          getCredits(),
          getAnalysisHistory(),
        ]);
        setCredits(creditsData.credits);
        setUnlimited(creditsData.unlimited);
        setHistory(historyData.analyses);
      } catch {
        clearToken();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-400">Gerencie seus créditos e histórico</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-white"
          >
            Sair
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-zinc-400">Créditos restantes</p>
          <p className="mt-1 text-4xl font-bold text-accent">
            {unlimited ? '∞ Ilimitado' : credits}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-accent px-6 py-2 text-sm font-semibold transition hover:bg-violet-500"
          >
            Nova análise
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Histórico de análises</h2>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Nenhuma análise ainda.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <span className="font-medium">@{item.target_username}</span>
                  <span className="text-xs text-zinc-500">
                    {new Date(item.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <PricingSection />
    </main>
  );
}
