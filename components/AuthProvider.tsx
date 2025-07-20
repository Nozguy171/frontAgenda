'use client'
import { createContext, ReactNode, useState, useEffect } from 'react'
import { apiFetch } from '../services/api'

interface AuthContextType {
  user: any|null
  login: (u: string, p: string) => Promise<void>
  signup: (u: string, p: string) => Promise<void>
  logout: () => void
}
export const AuthContext = createContext<AuthContextType>({} as any)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any|null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setUser({}) // opcional: fetch perfil
  }, [])

  const login = async (username: string, password: string) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    localStorage.setItem('token', data.access_token)
    setUser({ username })
  }

  const signup = async (username: string, password: string) => {
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    await login(username, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
