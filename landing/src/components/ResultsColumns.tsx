import FollowerCard from './FollowerCard';
import type { AnalyzeResult } from '@/lib/api';

type ResultsColumnsProps = {
  result: AnalyzeResult;
};

function Column({
  title,
  entries,
  accentClass,
}: {
  title: string;
  entries: AnalyzeResult['men'];
  accentClass: string;
}) {
  return (
    <div className="flex flex-col">
      <div className={`mb-3 flex items-center justify-between border-b border-border pb-2 ${accentClass}`}>
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-zinc-400">
          {entries.length}
        </span>
      </div>
      <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-600">Nenhum resultado</p>
        ) : (
          entries.map((entry) => (
            <FollowerCard key={entry.username} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ResultsColumns({ result }: ResultsColumnsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Column title="Homens" entries={result.men} accentClass="text-blue-400" />
      <Column title="Mulheres" entries={result.women} accentClass="text-pink-400" />
      <Column title="Desconhecido" entries={result.unknown} accentClass="text-zinc-400" />
    </div>
  );
}
