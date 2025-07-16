'use client'

interface AuthDebugInfo {
  tokens: {
    accessToken: string | null
    refreshToken: string | null
    expiryTime: string | null
    isExpired: boolean
  }
  user: {
    isAuthenticated: boolean
    userData: any
  }
  timestamp: string
}

export const debugAuthState = (): AuthDebugInfo => {
  if (typeof window === 'undefined') {
    return {
      tokens: {
        accessToken: null,
        refreshToken: null,
        expiryTime: null,
        isExpired: true,
      },
      user: {
        isAuthenticated: false,
        userData: null,
      },
      timestamp: new Date().toISOString(),
    }
  }

  // Token bilgilerini al
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  const expiryTime = localStorage.getItem('token_expiry')

  // Expiry kontrolü
  let isExpired = true
  if (expiryTime) {
    const expiry = parseInt(expiryTime)
    if (!isNaN(expiry)) {
      isExpired = Date.now() > expiry - 5 * 60 * 1000 // 5 dakika buffer
    }
  }

  // Redux store'dan user bilgisi al
  let userData = null
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (persistedState) {
      const parsed = JSON.parse(persistedState)
      const userState = JSON.parse(parsed.user || '{}')
      userData = userState.user
    }
  } catch (error) {
    console.warn('Debug: Could not read user state:', error)
  }

  const debugInfo: AuthDebugInfo = {
    tokens: {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
      expiryTime: expiryTime ? new Date(parseInt(expiryTime)).toISOString() : null,
      isExpired,
    },
    user: {
      isAuthenticated: !!(accessToken && refreshToken && !isExpired && userData),
      userData,
    },
    timestamp: new Date().toISOString(),
  }

  return debugInfo
}

export const logAuthDebug = (label: string = 'Auth Debug') => {
  if (process.env.NODE_ENV === 'development') {
    const debugInfo = debugAuthState()
    console.group(`🔐 ${label}`)
    console.table(debugInfo.tokens)
    console.log('User State:', debugInfo.user)
    console.log('Timestamp:', debugInfo.timestamp)
    console.groupEnd()
  }
}

export const validateTokenFormat = (token: string, tokenType: 'access' | 'refresh'): boolean => {
  if (!token) return false

  const expectedPrefix = `mock-${tokenType}-token-`
  if (!token.startsWith(expectedPrefix)) return false

  const parts = token.split('-')
  if (parts.length < 4) return false

  // User ID kontrolü (4. part)
  const userId = parts[3]
  if (!userId || userId.length === 0) return false

  return true
}
