import Image from 'next/image';
import type { FollowerEntry } from '@/lib/api';

type FollowerCardProps = {
  entry: FollowerEntry;
};

export default function FollowerCard({ entry }: FollowerCardProps) {
  const initials = (entry.display_name || entry.username || '?')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-border">
        {entry.profile_picture_url ? (
          <Image
            src={entry.profile_picture_url}
            alt={entry.username}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">@{entry.username}</p>
        {entry.display_name && (
          <p className="truncate text-xs text-zinc-500">{entry.display_name}</p>
        )}
        <p className="text-xs text-accent">{entry.gender_probability}%</p>
      </div>
    </div>
  );
}
