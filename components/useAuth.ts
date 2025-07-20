// frontend/src/components/useAuth.ts
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../services/api'

interface JwtPayload {
  identity: number
  exp: number
  // otros campos si tu token los incluye
}

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<JwtPayload | null>(null)

  // Al montar, verificar si hay token guardado
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      try {
        // Decodificar token (sin verificar firma)
        const payload: any = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch {
        localStorage.removeItem('token')
        setUser(null)
      }
    }
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      const token = data.access_token
      // Guardar token y actualizar user
      localStorage.setItem('token', token)
      const payload: any = JSON.parse(atob(token.split('.')[1]))
      setUser(payload)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      // Tras registrarse, iniciar sesión automáticamente
      return await login(username, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return { user, login, signup, logout, loading, error }
}
