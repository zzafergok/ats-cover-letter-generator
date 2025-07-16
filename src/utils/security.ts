import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-key'

export const secureStorage = {
  setItem: (key: string, value: string) => {
    const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString()
    localStorage.setItem(key, encrypted)
  },
  getItem: (key: string): string | null => {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch {
      return null
    }
  },
}
