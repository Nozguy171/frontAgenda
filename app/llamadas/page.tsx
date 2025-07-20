// frontend/src/app/llamadas/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout'
import LlamadasSection from '@/components/LlamadasSection'

export default function LlamadasPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <LlamadasSection />
      </Layout>
    </ProtectedRoute>
  )
}