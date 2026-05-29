import Header from '@/components/Header';
import AnalyzeForm from '@/components/AnalyzeForm';
import PricingSection from '@/components/PricingSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="flex flex-col items-center px-4 pb-8 pt-12 sm:pt-20">
        <p className="mb-4 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-medium text-accent">
          Sem extensão — 100% no servidor
        </p>
        <h1 className="max-w-xl text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Veja quem eles{' '}
          <span className="bg-gradient-to-r from-accent to-violet-300 bg-clip-text text-transparent">
            realmente seguem
          </span>
        </h1>
        <p className="mt-4 max-w-sm text-center text-sm text-zinc-400 sm:text-base">
          Digite qualquer username do Instagram e descubra a lista de seguidos separada por gênero.
        </p>
        <div className="mt-10 flex w-full flex-col items-center">
          <AnalyzeForm />
        </div>
      </section>
      <PricingSection />
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-zinc-600">
        Stalkr © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
