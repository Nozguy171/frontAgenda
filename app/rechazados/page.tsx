// frontend/src/app/rechazados/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout'
import RejectedSection from '@/components/RejectedSection'

export default function RechazadosPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="relative min-h-screen bg-gray-900 text-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-4">Rechazados</h1>
          <RejectedSection />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
