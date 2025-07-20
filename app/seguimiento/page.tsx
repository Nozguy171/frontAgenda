// frontend/src/app/iniciar-seguimiento/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout'
import FollowUpSection from '@/components/FollowUpSection'

export default function IniciarSeguimientoPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="relative min-h-screen bg-gray-900 text-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-4">Iniciar Seguimiento</h1>
          <FollowUpSection />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
