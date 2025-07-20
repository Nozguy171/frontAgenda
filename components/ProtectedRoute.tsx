// frontend/src/components/ProtectedRoute.tsx
'use client'
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  return <>{children}</>
}
