import { useState, useEffect } from 'react'
import { t, getLocale, setLocale } from './i18n'

export function useTranslation() {
  const [locale, setLocaleState] = useState(getLocale())

  useEffect(() => {
    const handleLocaleChange = () => setLocaleState(getLocale())
    window.addEventListener('localechange', handleLocaleChange)
    return () => window.removeEventListener('localechange', handleLocaleChange)
  }, [])

  return {
    t,
    locale,
    setLocale: (newLocale: string) => {
      setLocale(newLocale)
      setLocaleState(newLocale)
    }
  }
}
