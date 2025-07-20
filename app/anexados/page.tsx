// frontend/src/app/anexados/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout'
import AnexadosSection from '@/components/AnexadosSection'

export default function AnexadosPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <AnexadosSection />
      </Layout>
    </ProtectedRoute>
  )
}
