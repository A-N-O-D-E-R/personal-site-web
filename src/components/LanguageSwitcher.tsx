import { useTranslation } from '../i18n/useTranslation'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="fixed bottom-8 left-8 z-50 flex gap-2">
      <button
        onClick={() => setLocale('en')}
        className={`px-4 py-2 rounded-2xl transition text-2xl ${
          locale === 'en'
            ? 'bg-white/20 border border-white/30'
            : 'bg-white/[0.02] border border-white/20 hover:border-white/30 opacity-60'
        }`}
        style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
        title="English"
      >
        🇬🇧
      </button>
      <button
        onClick={() => setLocale('fr')}
        className={`px-4 py-2 rounded-2xl transition text-2xl ${
          locale === 'fr'
            ? 'bg-white/20 border border-white/30'
            : 'bg-white/[0.02] border border-white/20 hover:border-white/30 opacity-60'
        }`}
        style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
        title="Français"
      >
        🇫🇷
      </button>
      <button
        onClick={() => setLocale('de')}
        className={`px-4 py-2 rounded-2xl transition text-2xl ${
          locale === 'de'
            ? 'bg-white/20 border border-white/30'
            : 'bg-white/[0.02] border border-white/20 hover:border-white/30 opacity-60'
        }`}
        style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
        title="Deutsch"
      >
        🇩🇪
      </button>
    </div>
  )
}
