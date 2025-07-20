// frontend/src/components/FollowUpSection.tsx
'use client'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/services/api'
import FriendsModal from '@/components/FriendsModal'

function startOfToday() {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d
}

export default function FollowUpSection() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/prospects').then(all => {
      setList(all.filter((p: any) => p.status === 'sold'))
      setLoading(false)
    })
  }, [])

  const handleStart = async (id: number) => {
    await apiFetch(`/prospects/${id}/follow-up`, { method: 'POST' })
    setList(list.filter(p => p.id !== id))
  }

  const handleCall = async (id: number) => {
    const dt = prompt('Fecha y hora (YYYY-MM-DDTHH:MM):')
    if (!dt) return
    await apiFetch(`/prospects/${id}/call`, {
      method: 'POST',
      body: JSON.stringify({ datetime: dt })
    })
    setList(list.filter(p => p.id !== id))
  }

  const handleAttach = async (id: number) => {
    await apiFetch(`/prospects/${id}/status?status=anexado`, { method: 'PATCH' })
    setList(list.filter(p => p.id !== id))
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>

  const today0 = startOfToday()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {list.length ? list.map(p => {
        const hasFutureCall = p.calls?.some((c: any) =>
          new Date(c.scheduled_for) >= today0
        )
        return (
          <div key={p.id} className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h2 className="text-gray-100 text-lg font-semibold mb-2">{p.name}</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStart(p.id)}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
              >
                Iniciar seguimiento
              </button>
              {!hasFutureCall && (
                <button
                  onClick={() => handleCall(p.id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                >
                  Programar llamada
                </button>
              )}
              <FriendsModal prospect={{ id: p.id, name: p.name }} />
              <button
                onClick={() => handleAttach(p.id)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm"
              >
                Anexar
              </button>
            </div>
          </div>
        )
      }) : (
        <p className="text-gray-400 italic">No hay prospectos para iniciar seguimiento.</p>
      )}
    </div>
  )
}
