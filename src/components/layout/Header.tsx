'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import type { StudentSession } from '@/types'

interface HeaderProps {
  session?: StudentSession | null
  revisionSlug?: string
}

export function Header({ session, revisionSlug }: HeaderProps) {
  return (
    <header className="bg-brand-navy text-white px-4 py-3 sticky top-0 z-40 shadow-md">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link href={revisionSlug ? `/revisao/${revisionSlug}` : '/'}>
          <Logo variant="light" size="sm" />
        </Link>
        {session && (
          <div className="text-right">
            <p className="text-xs text-brand-gray-soft leading-none">{session.grade}</p>
            <p className="text-sm font-semibold text-brand-gold leading-tight">
              {session.displayName}
            </p>
          </div>
        )}
      </div>
    </header>
  )
}
