'use client';

import { useState } from 'react';
import { createCheckout, isLoggedIn } from '@/lib/api';
import { useRouter } from 'next/navigation';

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  priceType: '1' | '5' | 'unlimited';
  highlighted?: boolean;
};

export default function PricingCard({
  title,
  price,
  description,
  priceType,
  highlighted = false,
}: PricingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!isLoggedIn()) {
      router.push('/register');
      return;
    }

    setLoading(true);
    try {
      const { url } = await createCheckout(priceType);
      if (url) window.location.href = url;
    } catch {
      alert('Erro ao iniciar pagamento. Verifique as chaves do Stripe.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 ${
        highlighted
          ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
          : 'border-border bg-surface'
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-3xl font-bold text-accent">{price}</p>
      <p className="mt-2 flex-1 text-sm text-zinc-400">{description}</p>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`mt-4 w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 ${
          highlighted
            ? 'bg-accent text-white hover:bg-violet-500'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {loading ? 'Carregando...' : 'Comprar'}
      </button>
    </div>
  );
}
