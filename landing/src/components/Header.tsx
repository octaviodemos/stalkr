'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/lib/api';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span className="text-accent">Stalk</span>r
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-surface px-4 py-2 font-medium transition hover:bg-border"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-zinc-400 hover:text-white">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2 font-medium text-white transition hover:bg-violet-500"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
