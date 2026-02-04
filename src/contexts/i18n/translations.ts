import { buttons } from './translations/buttons'
import { inputs } from './translations/inputs'
import { inputsErrors } from './translations/inputs-errors'
import { labels } from './translations/labels'
import { texts } from './translations/texts'

export interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const mergeTranslations = (
  ...translationSets: Translations[]
): Translations => {
  const result: Translations = {}

  translationSets.forEach(set => {
    Object.keys(set).forEach(lang => {
      if (!result[lang]) {
        result[lang] = {}
      }
      result[lang] = {
        ...result[lang],
        ...set[lang]
      }
    })
  })

  return result
}

export const translations: Translations = mergeTranslations(
  labels,
  buttons,
  texts,
  inputs,
  inputsErrors
)
