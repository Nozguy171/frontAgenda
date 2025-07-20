'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import HistorySection from '@/components/HistorySection'
import Layout from '@/components/layout'

// Mapear estados a etiquetas legibles
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  'no-response': 'Sin respuesta',
  rejected: 'Rechazado',
  scheduled: 'Cita programada',
  'follow-up': 'En seguimiento'
}

export default function HistorialPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-100">Historial de Cambios</h1>
        </div>
        {/* Le pasamos el mapping para que lo use HistorySection */}
        <HistorySection statusLabels={statusLabels} />
      </Layout>
    </ProtectedRoute>
  )
}
