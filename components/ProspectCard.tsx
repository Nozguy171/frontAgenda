// frontend/src/components/ProspectCard.tsx
'use client'
import { useState } from 'react'
import { apiFetch } from '../services/api'
import FriendsModal from './FriendsModal'

const normalize = (s: string) => s.replace(/\u2011/g, '-')

function startOfToday() {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d
}

export default function ProspectCard(
  { prospect, onUpdate }: { prospect: any; onUpdate: (p: any) => void }
) {
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduleAddress, setScheduleAddress] = useState('')
  const [showCall, setShowCall] = useState(false)
  const [callTime, setCallTime] = useState('')

  const status = normalize(prospect.status)
  const today0 = startOfToday()
  const futureApps = prospect.appointments?.filter((a: any) =>
    new Date(a.scheduled_for) >= today0
  ) || []
  const futureCalls = prospect.calls?.filter((c: any) =>
    new Date(c.scheduled_for) >= today0
  ) || []
  const hasFutureAppt = prospect.appointments?.some((a: any) =>
    new Date(a.scheduled_for) >= today0
  )
  const hasFutureCall = prospect.calls?.some((c: any) =>
    new Date(c.scheduled_for) >= today0
  )
  const isBusy = showSchedule || showCall

  // Cambia estado genérico (incluye 'anexado')
  const changeStatus = async (newStatus: string) => {
    const updated = await apiFetch(
      `/prospects/${prospect.id}/status?status=${newStatus}`,
      { method: 'PATCH' }
    )
    onUpdate(updated)
  }

  // Cita
  const scheduleAppointment = async () => {
    const payload: any = { datetime: scheduleTime }
    if (scheduleAddress) payload.address = scheduleAddress
    const updated = await apiFetch(
      `/prospects/${prospect.id}/schedule`,
      { method: 'POST', body: JSON.stringify(payload) }
    )
    onUpdate(updated)
    setShowSchedule(false); setScheduleTime(''); setScheduleAddress('')
  }

  // Llamada
  const scheduleCall = async () => {
    const updated = await apiFetch(
      `/prospects/${prospect.id}/call`,
      { method: 'POST', body: JSON.stringify({ datetime: callTime }) }
    )
    onUpdate(updated)
    setShowCall(false); setCallTime('')
  }

  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-2 overflow-visible">
      <h3 className="text-lg font-semibold">{prospect.name}</h3>
      {prospect.phone && <p className="text-sm">Tel: {prospect.phone}</p>}
     {futureApps.map((a: any) => (
       <p key={a.id} className="text-teal-400 text-sm">
         Cita: {new Date(a.scheduled_for).toLocaleString()}
       </p>
     ))}
     {futureCalls.map((c: any) => (
       <p key={c.id} className="text-purple-400 text-sm">
         Llamada: {new Date(c.scheduled_for).toLocaleString()}
       </p>
     ))}
      <div className="flex flex-wrap gap-2">
        {/* Agendar cita */}
        {!hasFutureAppt && (
          <button
            onClick={() => { setShowSchedule(true); setShowCall(false) }}
            disabled={isBusy}
            className={`px-2 py-1 rounded text-sm text-white transition ${
              isBusy ? 'bg-green-600/50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            Agendar cita
          </button>
        )}

        {/* Cambiar a “Sin respuesta” */}
        {status !== 'no-response' && (
          <button
            onClick={() => changeStatus('no-response')}
            disabled={isBusy}
            className={`px-2 py-1 rounded text-sm text-white transition ${
              isBusy ? 'bg-yellow-500/50 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400'
            }`}
          >
            Sin respuesta
          </button>
        )}

        {/* Rechazar */}
        <button
          onClick={() => changeStatus('rejected')}
          disabled={isBusy}
          className={`px-2 py-1 rounded text-sm text-white transition ${
            isBusy ? 'bg-red-600/50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'
          }`}
        >
          Rechazar
        </button>

        {/* Programar llamada */}
        {!hasFutureCall && (
          <button
            onClick={() => { setShowCall(true); setShowSchedule(false) }}
            disabled={isBusy}
            className={`px-2 py-1 rounded text-sm text-white transition ${
              isBusy ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            Programar llamada
          </button>
        )}

        {/* Anexar (cambia status a anexado) */}
        <button
          onClick={() => changeStatus('anexado')}
          disabled={isBusy}
          className={`px-2 py-1 rounded text-sm text-white transition ${
            isBusy ? 'bg-purple-600/50 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'
          }`}
        >
          Anexar
        </button>

        {/* Ver amigos */}
        <FriendsModal prospect={prospect} />
      </div>

      {/* Formularios dinámicos */}
      {showSchedule && (
        <div className="mt-2 flex flex-col gap-2">
          <input
            type="datetime-local"
            value={scheduleTime}
            onChange={e => setScheduleTime(e.target.value)}
            className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={scheduleAddress}
            onChange={e => setScheduleAddress(e.target.value)}
            className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded px-2 py-1"
          />
          <div className="flex gap-2">
            <button
              onClick={scheduleAppointment}
              disabled={!scheduleTime}
              className="px-3 py-1 bg-green-500 hover:bg-green-400 text-white rounded disabled:bg-green-500/50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowSchedule(false)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showCall && (
        <div className="mt-2 flex flex-col gap-2">
          <input
            type="datetime-local"
            value={callTime}
            onChange={e => setCallTime(e.target.value)}
            className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded px-2 py-1"
          />
          <div className="flex gap-2">
            <button
              onClick={scheduleCall}
              disabled={!callTime}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded disabled:bg-blue-500/50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowCall(false)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
