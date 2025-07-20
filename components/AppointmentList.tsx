'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/services/api'
import FriendsModal from '@/components/FriendsModal'

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function AppointmentList({
  appointments
}: {
  appointments: any[]
}) {
  const [calls, setCalls] = useState<any[]>([])
  const today0 = startOfToday()

  useEffect(() => {
    apiFetch('/calls').then((data: any[]) => setCalls(data))
  }, [])

  return (
    <div className="flex-1">
      {appointments.length ? (
        appointments.map(app => {
          const hasFutureCall = calls.some(
            c => c.prospect_id === app.prospect_id && new Date(c.scheduled_for) >= today0
          )
          return (
            <div key={app.id} className="bg-gray-800 p-4 rounded mb-3">
              <div>
                <p className="text-gray-300 text-sm mb-1">Estado: {app.prospect_status}</p>
                <p className="font-mono mb-1">{new Date(app.scheduled_for).toLocaleTimeString()} - {app.prospect_name}</p>
                <p className="text-gray-400 text-sm mb-2">📍 {app.address || 'Sin dirección'}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {!hasFutureCall && (
                  <button
                    onClick={() => {
                      const dt = prompt('Fecha y hora de llamada (YYYY-MM-DDTHH:MM):')
                      if (!dt) return
                      apiFetch(`/prospects/${app.prospect_id}/call`, {
                        method: 'POST',
                        body: JSON.stringify({ datetime: dt })
                      }).then(() => setCalls(prev => [...prev, { prospect_id: app.prospect_id, scheduled_for: dt }]))
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Programar llamada
                  </button>
                )}
                <FriendsModal prospect={{ id: app.prospect_id, name: app.prospect_name }} />
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-gray-400">No hay citas para este día.</p>
      )}
    </div>
  )
}
