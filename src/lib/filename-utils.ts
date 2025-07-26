export const formatPdfFilename = (text: string): string => {
  const turkishToEnglishMap: Record<string, string> = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    I: 'I',
    İ: 'I',
    i: 'i',
    ö: 'o',
    Ö: 'O',
    ş: 's',
    Ş: 'S',
    ü: 'u',
    Ü: 'U',
  }

  return text
    .split('')
    .map((char) => turkishToEnglishMap[char] || char)
    .join('')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .split('_')
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()))
    .join('_')
}
