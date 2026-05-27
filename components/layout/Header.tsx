'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import { Container } from '@/components/common/Container'
import { FacebookIcon, LinkedinIcon } from '@/components/common/SocialIcons'
import { COMPANY, NAV_ITEMS } from '@/lib/constants'

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return scrolled
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-0">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-brand-red">
        <span className="font-sans text-sm font-bold text-white">A-KAS</span>
      </div>
      <span className="ml-2 hidden font-zh text-xs text-white/80 md:block">
        {COMPANY.nameZh}
      </span>
    </Link>
  )
}

function DesktopNav() {
  const pathname = usePathname()
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {NAV_ITEMS.map(({ label, href }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href} className="group relative text-sm text-white/80 transition-colors hover:text-white">
            {label}
            <span
              className={[
                'absolute -bottom-0.5 left-0 h-0.5 bg-brand-gold transition-transform duration-250 origin-left',
                active ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
              ].join(' ')}
            />
          </Link>
        )
      })}
    </nav>
  )
}

function LangSwitch() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh')
  return (
    <div className="hidden items-center gap-1 md:flex">
      <button
        onClick={() => setLang('zh')}
        className={`text-xs transition-colors ${lang === 'zh' ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        繁中
      </button>
      <span className="text-white/30 text-xs">|</span>
      <button
        onClick={() => setLang('en')}
        className={`text-xs transition-colors ${lang === 'en' ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col bg-brand-navy"
        >
          {/* 頂部 */}
          <div className="flex items-center justify-between px-4 py-5">
            <Logo />
            <button onClick={onClose} aria-label="關閉選單" className="text-white/70 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* 導覽連結 */}
          <nav className="flex flex-1 flex-col gap-1 px-6 pt-6">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  'py-3 text-lg font-zh transition-colors border-b border-white/10',
                  pathname === href ? 'text-brand-gold' : 'text-white/80 hover:text-white'
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 底部：社群 + 電話 */}
          <div className="px-6 py-8">
            <p className="mb-4 text-xs text-white/40 font-zh">{COMPANY.phone}</p>
            <div className="flex gap-4">
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/50 hover:text-brand-gold transition-colors"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/50 hover:text-brand-gold transition-colors"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const scrolled = useScrolled()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        animate={{
          backgroundColor: 'rgba(14,31,53,0.95)',
          borderBottomColor: 'rgba(184,154,94,0.30)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)'
        }}
        transition={{ duration: 0.3 }}
      >
        <Container className="flex h-[72px] items-center justify-between">
          <Logo />
          <DesktopNav />
          <div className="flex items-center gap-4">
            <LangSwitch />
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="開啟選單"
              className="text-white md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </Container>
      </motion.header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

export default Header
