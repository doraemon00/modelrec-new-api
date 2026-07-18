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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useSystemConfig } from '@/hooks/use-system-config'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Model Marketplace', to: '/pricing' },
      { label: 'Performance Rankings', to: '/rankings' },
      { label: 'Lab', to: '/playground' },
      { label: 'Billing Guide', to: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Developer Documentation', to: '/docs' },
      {
        label: 'Community Forum',
        href: 'https://docs.newapi.pro/support/community-interaction/',
      },
      { label: 'API Reference', href: 'https://docs.newapi.pro/api/' },
      { label: 'Changelog', href: 'https://docs.newapi.pro/' },
    ],
  },
  {
    title: 'Support',
    links: [
      {
        label: 'Contact Us',
        href: 'https://docs.newapi.pro/support/community-interaction/',
      },
      {
        label: 'Service Status',
        href: 'https://github.com/QuantumNous/new-api/issues',
      },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/user-agreement' },
    ],
  },
] as const

export function HomeFooter() {
  const { t } = useTranslation()
  const { systemName, footerHtml } = useSystemConfig()
  const currentYear = new Date().getFullYear()
  const displayName = systemName || t('AI Routing')
  const customFooterHtml = footerHtml?.trim()

  return (
    <footer className='min-h-[420px] bg-[#111827] px-6 py-16 text-[#9ca3af]'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-12 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.75fr))] md:gap-16'>
          <div>
            <div className='flex items-center gap-3'>
              <span className='text-2xl font-bold text-white'>
                {displayName}
              </span>
              <span className='rounded border border-white/20 px-2 py-0.5 text-xs text-[#d1d5db]'>
                V2.0
              </span>
            </div>
            <p className='mt-6 max-w-sm text-sm leading-7 text-[#9ca3af]'>
              {t(
                'Built for developers who need dependable model routing, evaluation, and recommendations for every AI request.'
              )}
            </p>
            {/* Social channel icons are temporarily hidden. */}
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className='text-sm font-semibold text-white'>
                {t(column.title)}
              </h3>
              <ul className='mt-6 space-y-4'>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {'href' in link ? (
                      <a
                        href={link.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm transition-colors hover:text-white'
                      >
                        {t(link.label)}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className='text-sm transition-colors hover:text-white'
                      >
                        {t(link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-14 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-7 text-xs'>
          {customFooterHtml ? (
            <div
              className='custom-footer min-w-0'
              // eslint-disable-next-line react/no-danger -- Footer HTML is administrator-managed, matching the shared footer contract.
              dangerouslySetInnerHTML={{ __html: customFooterHtml }}
            />
          ) : (
            <span>
              © {currentYear} {displayName}. {t('footer.defaultCopyright')}
            </span>
          )}
          {/* <span aria-hidden='true'>·</span>
          <a
            href='https://github.com/QuantumNous/new-api'
            target='_blank'
            rel='noopener noreferrer'
            className='transition-colors hover:text-white'
          >
            new-api / QuantumNous
          </a> */}

          {/* Footer policy and language shortcuts are temporarily hidden. */}
        </div>
      </div>
    </footer>
  )
}
