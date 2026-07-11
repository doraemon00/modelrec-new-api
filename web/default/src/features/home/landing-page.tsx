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
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronDown,
  Code,
  Copy,
  DollarSign,
  Monitor,
  Activity,
  CircleDot,
  Globe,
  MessageCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// ============================================================================
// Landing Page - New static home page matching reference design
// ============================================================================

export function LandingPage() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user

  return (
    <PublicLayout showMainContainer={false}>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeatureCards />
      <QuickStartSection isAuthenticated={isAuthenticated} />
      <FAQSection />
      <LandingFooter />
    </PublicLayout>
  )
}

// ============================================================================
// Hero Section
// ============================================================================

function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useTranslation()

  return (
    <section className='relative overflow-hidden px-6 pt-28 pb-16 md:pt-36 md:pb-14'>
      {/* Background gradient - soft lavender glow */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 sf-hero-glow'
      />

      <div className='mx-auto max-w-4xl text-center'>
        <AnimateInView animation='fade-up' delay={0}>
          <h1 className='text-[clamp(3rem,6vw,4.5rem)] leading-[1.15] font-bold tracking-tight hero-title-gradient'>
            {t('AI Model Recommendation')}
          </h1>
          <p className='mt-4 text-lg text-gray-800 md:text-xl dark:text-gray-200'>
            {t('Better quality, better understanding')}
          </p>
        </AnimateInView>

        <AnimateInView animation='fade-up' delay={150}>
          <div className='mt-8 flex items-center justify-center gap-4'>
            {isAuthenticated ? (
              <Button
                size='lg'
                className='h-12 rounded-full px-8 text-base font-medium sf-btn-primary'
                render={<Link to='/dashboard/models' />}
              >
                {t('Go to Dashboard')}
                <ArrowRight className='ml-2 size-4' />
              </Button>
            ) : (
              <>
                <Button
                  size='lg'
                  className='h-12 rounded-lg px-8 text-base font-medium sf-btn-primary'
                  render={<Link to='/sign-in' />}
                >
                  {t('Get API Key')}
                </Button>
                <Button
                  variant='outline'
                  size='lg'
                  className='h-12 rounded-lg px-8 text-base font-medium border-[#d1d5db] bg-white text-black hover:bg-white hover:border-[#9ca3af] dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-900 dark:hover:border-gray-400'
                  render={<Link to='/pricing' />}
                >
                  {t('Configure Market')}
                </Button>
              </>
            )}
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}

// ============================================================================
// Feature Cards
// ============================================================================

const FEATURES = [
  {
    icon: CircleDot,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    titleKey: 'feature.anyModelApi.title',
    descKey: 'feature.anyModelApi.desc',
  },
  {
    icon: DollarSign,
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-500/10',
    titleKey: 'feature.billingRateLimit.title',
    descKey: 'feature.billingRateLimit.desc',
  },
  {
    icon: Activity,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    titleKey: 'feature.performanceMonitor.title',
    descKey: 'feature.performanceMonitor.desc',
  },
  {
    icon: Code,
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-500/10',
    titleKey: 'feature.developerSdk.title',
    descKey: 'feature.developerSdk.desc',
  },
] as const

function FeatureCards() {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 px-6 py-10 md:py-16'>
      <div className='mx-auto grid max-w-5xl gap-5 md:grid-cols-4'>
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <AnimateInView key={f.titleKey} delay={i * 100} animation='scale-in'>
              <div className='group flex flex-col items-center rounded-2xl border border-[#ececee] bg-background p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-2 hover:border-primary/40 dark:border-gray-700 dark:hover:border-primary/60'>
                <div
                  className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${f.bgColor}`}
                >
                  <Icon className={`size-6 ${f.color}`} strokeWidth={1.5} />
                </div>
                <h3 className='mb-2 text-base font-semibold'>
                  {t(f.titleKey)}
                </h3>
                <p className='text-muted-foreground leading-relaxed text-xs'>
                  {t(f.descKey)}
                </p>
              </div>
            </AnimateInView>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================================
// Quick Start Section (3-minute setup)
// ============================================================================

const SETUP_STEPS = [
  {
    num: '1',
    numBg: 'sf-step-green',
    titleKey: 'setup.step1.title',
    descKey: 'setup.step1.desc',
  },
  {
    num: '2',
    numBg: 'bg-primary',
    titleKey: 'setup.step2.title',
    descKey: 'setup.step2.desc',
  },
  {
    num: '3',
    numBg: 'sf-step-green',
    titleKey: 'setup.step3.title',
    descKey: 'setup.step3.desc',
  },
] as const

function QuickStartSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 px-6 py-10 md:py-16'>
      <div className='mx-auto max-w-5xl'>
        <div className='grid grid-cols-1 gap-0 rounded-3xl bg-[#f9fafb] shadow-lg dark:bg-gray-900 md:grid-cols-[1fr_1fr]'>
          {/* Left: Steps */}
          <div className='flex flex-col justify-center rounded-t-3xl bg-white p-8 md:rounded-l-3xl md:rounded-tr-none lg:p-12 dark:bg-gray-900'>
            <AnimateInView animation='fade-right' delay={0}>
              <h2 className='mb-8 text-3xl font-bold tracking-tight md:text-4xl'>
                {t('setup.title')}
              </h2>

              <div className='space-y-5'>
                {SETUP_STEPS.map((step) => (
                  <div
                    key={step.num}
                    className='flex items-start gap-4'
                  >
                    <div
                      className={`flex shrink-0 size-9 items-center justify-center rounded-full ${step.numBg} text-white text-sm font-bold`}
                    >
                      {step.num}
                    </div>
                    <div className='pt-0.5'>
                      <p className='text-base font-semibold'>
                        {t(step.titleKey)}
                      </p>
                      <p className='mt-1 text-muted-foreground text-sm leading-relaxed'>
                        {t(step.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-8'>
                <Button
                  size='lg'
                  className='rounded-lg px-8 sf-btn-primary'
                  render={<Link to={isAuthenticated ? '/wallet' : '/sign-in'} />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-2 size-4' />
                </Button>
              </div>
            </AnimateInView>
          </div>

          {/* Right: Mock App Preview */}
          <div className='flex items-center justify-center p-6 md:p-8 lg:p-12'>
            <AnimateInView animation='fade-left' delay={200} className='w-full flex justify-center'>
              <MockAppPreview />
            </AnimateInView>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// Mock App Preview (right side of Quick Start section)
// ============================================================================

function MockAppPreview() {
  const { t } = useTranslation()

  return (
    <div className='relative' style={{ width: '306px' }}>
      {/* Phone frame */}
      <div className='h-[410px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl dark:bg-gray-900'>
        {/* iOS-style status bar: time | centered notch | icons */}
        <div className='grid grid-cols-3 items-center px-6 pt-3 pb-2'>
          <span className='text-[11px] font-semibold text-black/70 dark:text-white/70'>9:41</span>
          <div className='flex justify-center'>
            <div className='h-[22px] w-[90px] rounded-full bg-black/90' />
          </div>
          <div className='flex items-center justify-end gap-1 text-[11px] text-black/60 dark:text-white/60'>
            <svg className='size-3.5' viewBox='0 0 24 24' fill='currentColor'><path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 008.107 8.107c-.002.13-.002.261-.002.393A8.498 8.498 0 1112 3z'/></svg>
            <svg className='size-3' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}><path d='M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01'/></svg>
            <svg className='size-3.5' viewBox='0 0 24 24' fill='currentColor'><rect x='2' y='7' width='18' height='10' rx='2' stroke='currentColor' strokeWidth={1.5} fill='none'/><path d='M23 10l-3 2 3 2V10z'/><rect x='4' y='9' width='12' height='6' rx='0.5' fill='currentColor'/></svg>
          </div>
        </div>

        {/* App header bar */}
        <div className='flex items-center justify-between px-5 pb-3 pt-1'>
          <span className='text-sm font-bold tracking-tight text-gray-800 dark:text-white'>
          燧元路由</span>
          <span className='text-xs font-medium text-primary'>API 设置</span>
        </div>

        {/* App content */}
        <div className='space-y-3.5 px-4 pb-6'>
          {/* Action cards row — 3 columns like reference */}
          <div className='grid grid-cols-3 gap-2'>
            {[
              { label: '充值', icon: '🔑', bg: 'bg-emerald-50/90 dark:bg-emerald-900/15' },
              { label: '收藏', icon: '❤️', bg: 'bg-orange-50/90 dark:bg-orange-900/15' },
              { label: '设置', icon: '⚙️', bg: 'bg-slate-50/90 dark:bg-slate-800/40' },
            ].map((card) => (
              <div
                key={card.label}
                className={`flex flex-col items-center justify-center rounded-2xl border border-border/20 py-3 ${card.bg}`}
              >
                <span className='text-lg leading-none'>{card.icon}</span>
                <span className='mt-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300'>
                  {card.label}
                </span>
              </div>
            ))}
          </div>

          {/* API Key input area */}
          <div className='rounded-2xl border border-border/30 bg-muted/20 p-3 dark:border-gray-700/50 dark:bg-gray-800/50'>
            <p className='mb-1.5 text-[11px] font-medium text-muted-foreground dark:text-gray-400'>
              API Key
            </p>
            <div className='rounded-lg border border-border/40 bg-background px-3 py-2 font-mono text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'>
              sk-mh-xxxxxxxx...
            </div>
            <button
              type='button'
              className='mt-2 flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80'
            >
              <Copy className='size-3' />
              一键复制
            </button>
          </div>

          {/* Model list */}
          <div className='space-y-2'>
            {[
              { name: 'DeepSeek', tag: '在线' },
              { name: 'Qwen', tag: '在线' },
            ].map((model) => (
              <div
                key={model.name}
                className='flex items-center justify-between rounded-xl border border-border/20 bg-card px-3.5 py-2.5'
              >
                <div className='flex items-center gap-2.5'>
                  <div className='flex size-5 shrink-0 items-center justify-center'>
                    <span className='inline-block size-2.5 rounded-full bg-emerald-500' />
                  </div>
                  <span className='text-[13px] font-semibold text-gray-800 dark:text-gray-200'>
                    {model.name}
                  </span>
                </div>
                <span className='text-[11px] text-gray-400 dark:text-gray-500'>
                  {model.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative glow behind phone */}
      <div
        aria-hidden
        className='-z-10 absolute inset-x-4 top-[-12px] h-[calc(100%+24px)] rounded-[2.5rem] bg-gradient-to-br from-orange-200/25 via-amber-200/18 to-transparent blur-2xl dark:from-orange-900/12 dark:via-amber-900/7'
      />
    </div>
  )
}

// ============================================================================
// FAQ Section
// ============================================================================

const FAQ_ITEMS = [
  {
    q: 'faq.q1.question',
    a: 'faq.q1.answer',
  },
  {
    q: 'faq.q2.question',
    a: 'faq.q2.answer',
  },
  {
    q: 'faq.q3.question',
    a: 'faq.q3.answer',
  },
  {
    q: 'faq.q4.question',
    a: 'faq.q4.answer',
  },
] as const

function FAQSection() {
  const { t } = useTranslation()
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <section className='relative z-10 px-6 py-10 md:py-16'>
      <div className='mx-auto max-w-3xl'>
        <AnimateInView animation='fade-up' className='mb-8 text-center'>
          <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>
            {t('faq.title')}
          </h2>
        </AnimateInView>

        <div className='space-y-3'>
          {FAQ_ITEMS.map((item, i) => (
            <AnimateInView key={item.q} delay={i * 80} animation='fade-up'>
              <Collapsible
                open={openItem === item.q}
                onOpenChange={(open) =>
                  setOpenItem(open ? item.q : null)
                }
              >
                <div className='border-border/40 overflow-hidden rounded-xl border bg-background transition-colors hover:border-border/60'>
                  <CollapsibleTrigger className='flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium transition-colors hover:bg-muted/30'>
                    <span>Q: {t(item.q)}</span>
                    <ChevronDown
                      className={`text-muted-foreground size-4 shrink-0 transition-transform duration-200 ${
                        openItem === item.q ? 'rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='border-t border-border/30 px-6 pb-5 pt-4 text-muted-foreground text-sm leading-relaxed'>
                      {t(item.a)}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// Landing Footer
// ============================================================================

const FOOTER_PRODUCT_LINKS = [
  { labelKey: 'footer.product.pricing', href: '/pricing' },
  { labelKey: 'footer.product.compare', href: '/model' },
  { labelKey: 'footer.product.plans', href: '/pricing' },
  { labelKey: 'footer.product.payment', href: '/top-up' },
] as const

const FOOTER_DEVELOPER_LINKS = [
  { labelKey: 'footer.developer.apiDocs', href: '/dashboard' },
  { labelKey: 'footer.developer.sdk', href: '#' },
  { labelKey: 'footer.developer.github', href: '#' },
  { labelKey: 'footer.developer.forum', href: '#' },
] as const

function LandingFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className='border-border/40 relative z-10 border-t bg-muted/20'>
      <div className='mx-auto max-w-6xl px-6 py-10 md:py-14'>
        <div className='flex flex-col justify-between gap-10 md:flex-row md:gap-16'>
          {/* Brand column */}
          <div className='shrink-0 max-w-[240px]'>
            <Link to='/' className='group flex items-center gap-2.5'>
              <div className='bg-primary/10 flex size-8 items-center justify-center rounded-lg text-sm font-bold text-primary'>
                M
              </div>
              <span className='text-base font-semibold tracking-tight'>
                燧元路由
              </span>
            </Link>
            <p className='text-muted-foreground mt-2 mb-1 text-sm font-medium'>
              {t('footer.brand.tagline')}
            </p>
            <p className='text-muted-foreground/60 text-sm leading-relaxed'>
              {t('footer.brand.description')}
            </p>
          </div>

          {/* Product column */}
          <div>
            <h4 className='mb-3 text-xs font-semibold tracking-wider'>
              {t('footer.columns.product')}
            </h4>
            <ul className='space-y-2.5'>
              {FOOTER_PRODUCT_LINKS.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm'
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer column */}
          <div>
            <h4 className='mb-3 text-xs font-semibold tracking-wider'>
              {t('footer.columns.developer')}
            </h4>
            <ul className='space-y-2.5'>
              {FOOTER_DEVELOPER_LINKS.map((link) => (
                <li key={link.labelKey}>
                  {link.href.startsWith('http') || link.href === '#' ? (
                    <a
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm'
                    >
                      {t(link.labelKey)}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm'
                    >
                      {t(link.labelKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow us column */}
          <div>
            <h4 className='mb-3 text-xs font-semibold tracking-wider'>
              {t('footer.columns.followUs')}
            </h4>
            <div className='flex gap-3'>
              <a
                href='#'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg border border-border/50 transition-all hover:text-foreground'
                aria-label='GitHub'
              >
                <svg viewBox='0 0 24 24' className='size-4 fill-current'><path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z'/></svg>
              </a>
              <a
                href='#'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg border border-border/50 transition-all hover:text-foreground'
                aria-label='Twitter / X'
              >
                <MessageCircle className='size-4' />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className='border-border/30 mt-8 flex items-center justify-between border-t pt-5 text-xs text-muted-foreground/40'>
          <span>&copy; {currentYear} 燧元路由. {t('footer.copyright')}</span>
        </div>
      </div>
    </footer>
  )
}
