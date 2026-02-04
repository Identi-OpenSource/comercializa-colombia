import { translations } from './translations'

type TextModifier = 'uppercase' | 'lowercase' | 'capitalize' | 'title'

interface TranslationOptions {
  modifier?: TextModifier
  values?: Record<string, string | number> // Añadimos 'values' para interpolación
}

const defaultLocale = 'ES'

export class I18n {
  private locale: string

  constructor(locale: string = defaultLocale) {
    this.locale = locale
  }

  public getLocale(): string {
    return this.locale
  }

  public setLocale(locale: string): void {
    this.locale = locale
  }

  public t(key: string, options: TranslationOptions = {}): string {
    const localeTranslations = translations[this.locale] || translations.default
    let text = localeTranslations[key] || translations.default[key] || key

    // Si hay valores para interpolación, los reemplazamos en el texto
    if (options.values) {
      Object.keys(options.values).forEach(placeholder => {
        text = text.replace(
          `{{${placeholder}}}`,
          String(options.values![placeholder])
        )
      })
    }

    if (options.modifier) {
      text = this.applyModifier(text, options.modifier)
    }

    return text
  }

  private applyModifier(text: string, modifier: TextModifier): string {
    switch (modifier) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'capitalize':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      case 'title':
        return text
          .split(' ')
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(' ')
      default:
        return text
    }
  }
}

const i18n = new I18n()

export default i18n
