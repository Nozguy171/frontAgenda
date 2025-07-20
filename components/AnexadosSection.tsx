// frontend/src/components/AnexadosSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/services/api'
import FriendsModal from './FriendsModal'
import { ProspectHistory } from './HistoryCard'
import HistoryModal from './HistoryModal'

export default function AnexadosSection() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ProspectHistory | null>(null)

  useEffect(() => {
    apiFetch('/prospects')
      .then((all: any[]) => setList(all.filter(p => p.status === 'anexado')))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fetchHistory = (p: any) => {
    apiFetch('/history')
      .then((data: ProspectHistory[]) => {
        const rec = data.find(h => h.prospect_id === p.id)
        setSelected(
          rec || { prospect_id: p.id, name: p.name, phone: p.phone, observation: p.observation, history: [] }
        )
      })
      .catch(() => {
        setSelected({ prospect_id: p.id, name: p.name, phone: p.phone, observation: p.observation, history: [] })
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <span className="text-lg">Cargando anexados…</span>
      </div>
    )
  }

  return (
    <>
      {/* Contenedor principal sin blur */}
      <div className="relative min-h-screen bg-gray-900 text-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Anexados</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.length ? (
            list.map(p => (
              <div key={p.id} className="bg-gray-800 p-4 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
                <p className="text-sm mb-4">Tel: {p.phone}</p>
                <div className="flex flex-wrap gap-2">
                  <FriendsModal prospect={p} />
                  <button
                    onClick={() => fetchHistory(p)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                  >
                    Ver historial
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-gray-400">No hay contactos anexados.</p>
          )}
        </div>
      </div>

      {/* Modal con overlay blur */}
      {selected && (
        <HistoryModal
          prospect={selected}
          statusLabels={{
            pending: 'Pendiente',
            'no-response': 'Sin respuesta',
            rejected: 'Rechazado',
            scheduled: 'Cita programada',
            'follow-up': 'En seguimiento',
            anexado: 'Anexado'
          }}
          open={true}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
