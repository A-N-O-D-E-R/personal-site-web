import { NavLink } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useState } from 'react'
import { useTranslation } from '../i18n/useTranslation'

export default function Nav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full transition font-medium ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`

  const links = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/experience" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.experience')}
      </NavLink>
      <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.projects')}
      </NavLink>
      <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.about')}
      </NavLink>
      <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.blog')}
      </NavLink>
    </>
  )

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 right-4 z-50 p-3 bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-2xl"
          style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-white/80 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white/80 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white/80"></div>
        </button>
        <nav
          className={`fixed top-0 right-0 bottom-0 w-64 bg-white/[0.02] backdrop-blur-2xl border-l border-white/20 z-40 flex flex-col gap-2 p-8 transition-transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
        >
          {links}
        </nav>
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          />
        )}
      </>
    )
  }

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-40 bg-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-full px-6 py-3 flex gap-2 shadow-2xl" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
      {links}
    </nav>
  )
}
