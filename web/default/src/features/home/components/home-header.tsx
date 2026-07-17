import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Menu01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'
/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProfileDropdown } from '@/components/profile-dropdown'
import { useSystemConfig } from '@/hooks/use-system-config'
import { formatQuota } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { HomeModelSearch } from './home-model-search'

const HOME_NAV_LINKS = [
  { label: 'Model Marketplace', to: '/pricing' },
  { label: 'Rankings', to: '/rankings' },
  { label: 'Playground', to: '/playground' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Console', to: '/dashboard' },
  {
    label: 'Forum',
    href: 'https://docs.newapi.pro/support/community-interaction/',
  },
  { label: 'Docs', to: '/docs' },
] as const

export function HomeHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const { auth } = useAuthStore()
  const user = auth.user

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    }
  }

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-50 h-[61px] border-b border-[#e5e7eb] bg-white/95 dark:border-white/10 dark:bg-[#11131a]'>
        <nav className='flex h-full items-center gap-8 px-6'>
          <div className='flex shrink-0 items-center gap-1.5'>
            <button
              type='button'
              onClick={goBack}
              className='dark:text-foreground flex size-6 items-center justify-center rounded-md text-[#111827] transition-colors hover:bg-black/5 dark:hover:bg-white/10'
              aria-label={t('Back')}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className='size-4' />
            </button>
            <Link
              to='/'
              className='text-lg font-bold tracking-tight text-[#ff8700]'
            >
              {systemName || t('AI Routing')}
            </Link>
          </div>

          <div className='hidden min-[1180px]:block'>
            <HomeModelSearch />
          </div>

          <div className='ml-auto hidden min-w-0 flex-1 items-center justify-end gap-0.5 lg:flex'>
            {HOME_NAV_LINKS.map((link) =>
              'href' in link ? (
                <a
                  key={link.label}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='dark:text-muted-foreground dark:hover:text-foreground rounded-lg px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-[#374151] transition-colors hover:bg-black/5 hover:text-[#111827] dark:hover:bg-white/10'
                >
                  {t(link.label)}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className='dark:text-muted-foreground dark:hover:text-foreground rounded-lg px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-[#374151] transition-colors hover:bg-black/5 hover:text-[#111827] dark:hover:bg-white/10'
                >
                  {link.label === 'Playground' ? link.label : t(link.label)}
                </Link>
              )
            )}
          </div>

          <div className='hidden shrink-0 items-center gap-3 border-l border-[#e5e7eb] pl-4 lg:flex dark:border-white/10'>
            {user && (
              <Link to='/wallet' className='text-right leading-tight'>
                <span className='block text-[10px] font-medium tracking-wide text-[#9ca3af] uppercase'>
                  {t('Balance')}
                </span>
                <span className='block text-xs font-bold text-[#047857]'>
                  {formatQuota(user.quota ?? 0)}
                </span>
              </Link>
            )}

            {!user && (
              <Link
                to='/sign-up'
                className='sf-btn-primary inline-flex h-9 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white'
              >
                {t('Register')}
              </Link>
            )}

            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to='/sign-in'
                aria-label={t('Sign in')}
                className='flex size-9 items-center justify-center rounded-full bg-[#eef2ff] text-[#4338ca] transition-transform hover:scale-105'
              >
                <HugeiconsIcon icon={UserCircleIcon} className='size-6' />
              </Link>
            )}
          </div>

          <button
            type='button'
            onClick={() => setMobileOpen((open) => !open)}
            className='sf-home-menu-trigger dark:text-foreground ml-auto size-9 items-center justify-center rounded-lg text-[#111827] transition-colors hover:bg-black/5 dark:hover:bg-white/10'
            aria-label={t('Toggle navigation menu')}
            aria-expanded={mobileOpen}
          >
            <HugeiconsIcon
              icon={mobileOpen ? Cancel01Icon : Menu01Icon}
              className='size-5'
            />
          </button>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-x-0 top-[61px] bottom-0 z-40 bg-white px-6 py-8 transition-[opacity,transform] duration-300 dark:bg-[#15141a] lg:hidden',
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav className='flex flex-col gap-1'>
          {HOME_NAV_LINKS.map((link) =>
            'href' in link ? (
              <a
                key={link.label}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => setMobileOpen(false)}
                className='dark:text-muted-foreground px-2 py-3 text-center text-base font-medium text-[#374151] transition-colors hover:text-[#ff8700]'
              >
                {link.label === 'Playground' ? link.label : t(link.label)}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className='dark:text-muted-foreground px-2 py-3 text-center text-base font-medium text-[#374151] transition-colors hover:text-[#ff8700]'
              >
                {link.label === 'Playground' ? link.label : t(link.label)}
              </Link>
            )
          )}
        </nav>

        <div className='mt-8 grid grid-cols-2 gap-3'>
          <Link
            to='/sign-in'
            onClick={() => setMobileOpen(false)}
            className='dark:bg-card inline-flex h-11 items-center justify-center rounded-xl border border-[#d8d9dd] bg-white text-sm font-semibold'
          >
            {t('Sign in')}
          </Link>
          <Link
            to='/sign-up'
            onClick={() => setMobileOpen(false)}
            className='sf-btn-primary inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white'
          >
            {t('Register')}
          </Link>
        </div>
      </div>
    </>
  )
}
