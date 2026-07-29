import en from './messages/en.json'
import fr from './messages/fr.json'
import de from './messages/de.json'

const messages: Record<string, Record<string, string>> = { en, fr, de }

let currentLocale = navigator.language.split('-')[0] || 'en'

export const setLocale = (locale: string) => {
  currentLocale = locale
  localStorage.setItem('locale', locale)
  window.dispatchEvent(new Event('localechange'))
}

export const getLocale = () => {
  if (!currentLocale) {
    currentLocale = localStorage.getItem('locale') || navigator.language.split('-')[0] || 'en'
  }
  return currentLocale
}

export const t = (key: string, values?: Record<string, string | number>): string => {
  const locale = getLocale()
  let message = messages[locale]?.[key] || messages.en[key] || key

  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      message = message.replace(`{${k}}`, String(v))
    })
  }

  return message
}
