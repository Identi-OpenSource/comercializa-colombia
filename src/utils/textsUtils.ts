export function searchInString(text: string, words: string[]) {
  return words.some(word => text.toLowerCase().includes(word.toLowerCase()))
}

export function firstLetterUpperCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function firstLetterOfEachWordCapitalized(text: string) {
  return text
    .split(' ') // Dividimos el texto en un array de palabras
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizamos la primera letra de cada palabra
    .join(' ') // Volvemos a unir las palabras con espacios
}
