'use client';

import PricingCard from './PricingCard';

type NoCreditsModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function NoCreditsModal({ open, onClose }: NoCreditsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Quer analisar outro perfil?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Você não tem mais créditos. Compre mais para continuar investigando.
        </p>
        <div className="mt-6 grid gap-3">
          <PricingCard
            title="1 análise"
            price="R$ 9,90"
            description="Uma análise extra."
            priceType="1"
          />
          <PricingCard
            title="5 análises"
            price="R$ 34,90"
            description="Pacote com desconto."
            priceType="5"
            highlighted
          />
          <PricingCard
            title="Ilimitado"
            price="R$ 19,90/mês"
            description="Análises sem limite por 30 dias."
            priceType="unlimited"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-zinc-500 hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
