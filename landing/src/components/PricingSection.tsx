import PricingCard from './PricingCard';

export default function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Preços</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-zinc-400">
          Escolha o plano ideal para descobrir quem eles realmente seguem.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <PricingCard
            title="1 análise"
            price="R$ 9,90"
            description="Perfeito para uma única investigação."
            priceType="1"
          />
          <PricingCard
            title="5 análises"
            price="R$ 34,90"
            description="Melhor custo-benefício para vários perfis."
            priceType="5"
            highlighted
          />
          <PricingCard
            title="Ilimitado"
            price="R$ 19,90/mês"
            description="Análises ilimitadas por 30 dias."
            priceType="unlimited"
          />
        </div>
      </div>
    </section>
  );
}
