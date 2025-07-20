// frontend/src/app/citas/page.tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { apiFetch } from '../../services/api'
import Layout from '../../components/layout'
import { useAuth } from '../../components/useAuth'
import FriendsModal from '@/components/FriendsModal'

const Calendar = dynamic(() => import('react-calendar'), { ssr: false })

// Mapear estados a etiquetas legibles
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  'no-response': 'Sin respuesta',
  rejected: 'Rechazado',
  scheduled: 'Cita programada',
  'follow-up': 'En seguimiento'
}

function formatLocalDateKey(d: Date): string {
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10)
}

function formatLocalTime(d: Date): string {
  const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
  return new Intl.DateTimeFormat('en-US', opts).format(d)
}

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function CitasPage() {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [calls, setCalls] = useState<any[]>([])

  // Carga inicial citas y llamadas
  useEffect(() => {
    refresh()
    apiFetch('/calls').then(setCalls)
  }, [])

  const refresh = () => apiFetch('/appointments').then(setAppointments)

  // Fechas con citas para marcar en calendario
  const datesWithApps = useMemo(
    () => new Set(appointments.map(a => formatLocalDateKey(new Date(a.scheduled_for)))),
    [appointments]
  )

  const onDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) setSelectedDate(value)
  }

  const dayKey = formatLocalDateKey(selectedDate)
  const dayApps = appointments.filter(
    a => formatLocalDateKey(new Date(a.scheduled_for)) === dayKey
  )

  const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
  const year = selectedDate.getFullYear()
  const day = String(selectedDate.getDate()).padStart(2, '0')
  const formattedMonthYear = `${month}/${year}`
  const formattedDay = `${day}/${month}/${year}`

  // Helpers
  const today0 = startOfToday()
  const hasFutureCall = (prospectId: number) =>
    calls.some(c => c.prospect_id === prospectId && new Date(c.scheduled_for) >= today0)

  // Actions
  const markSold = async (id: number) => {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'sold' })
    })
    refresh()
  }
  const markRejected = async (id: number) => {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'rejected' })
    })
    refresh()
  }
  const confirmReschedule = async (prospectId: number) => {
    await apiFetch(`/prospects/${prospectId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({
        datetime: rescheduleDate,
        address: rescheduleAddress
      })
    })
    setShowRescheduleFor(null)
    setRescheduleDate('')
    setRescheduleAddress('')
    refresh()
  }
  const scheduleCall = async (prospectId: number) => {
    const dt = prompt('Fecha y hora de llamada (YYYY-MM-DDTHH:MM):')
    if (!dt) return
    await apiFetch(`/prospects/${prospectId}/call`, {
      method: 'POST',
      body: JSON.stringify({ datetime: dt })
    })
    setCalls(prev => [...prev, { prospect_id: prospectId, scheduled_for: dt }])
  }

  // Reschedule state
  const [showRescheduleFor, setShowRescheduleFor] = useState<number | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState<string>('')
  const [rescheduleAddress, setRescheduleAddress] = useState<string>('')

  return (
    <ProtectedRoute>
      <Layout>
        <div className="relative min-h-screen bg-gray-900 text-gray-100 p-6">


          <h1 className="text-3xl font-bold mb-4">Citas</h1>
          <div className="mb-4 text-lg">
            <span className="font-medium">Mes/Año:</span> {formattedMonthYear}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendario fijo de altura */}
            <div className="flex-none max-h-[400px] overflow-auto">
              <Calendar
                onChange={onDateChange}
                value={selectedDate}
                className="react-calendar bg-gray-800 text-gray-100 rounded-lg shadow"
                tileContent={({ date, view }) =>
                  view === 'month' && datesWithApps.has(formatLocalDateKey(date)) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <span className="block w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  )
                }
                tileClassName={({ date, view }) =>
                  view === 'month'
                    ? `relative ${datesWithApps.has(formatLocalDateKey(date)) ? 'bg-gray-700' : ''}`
                    : ''
                }
              />
            </div>

            {/* Lista de citas del día */}
            <div className="flex-1">
              <h2 className="text-2xl mb-2">Citas del día ({formattedDay})</h2>
              {dayApps.length ? (
                dayApps.map(app => {
                  const raw = app.prospect_status || ''
                  const norm = raw.replace(/\u2011/g, '-')
                  const label = statusLabels[norm] || raw
                  const isoLocal = new Date(app.scheduled_for).toISOString().slice(0,16)
                  return (
                    <div key={app.id} className="bg-gray-800 p-4 rounded mb-3">
                      <div>
                        <p className="text-gray-300 text-sm mb-1">Estado: {label}</p>
                        <p className="font-mono mb-1">{formatLocalTime(new Date(app.scheduled_for))} - {app.prospect_name}</p>
                        <p className="text-gray-400 text-sm mb-2">📍 {app.address || 'Sin dirección asignada'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {norm !== 'follow-up' && (
                          <button
                            onClick={() => markSold(app.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Vendido
                          </button>
                        )}
                        {norm !== 'rejected' && (
                          <button
                            onClick={() => markRejected(app.id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Rechazado
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowRescheduleFor(app.id)
                            setRescheduleDate(isoLocal)
                            setRescheduleAddress(app.address || '')
                          }}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded text-sm"
                        >
                          Reagendar
                        </button>
                        {!hasFutureCall(app.prospect_id) && (
                          <button
                            onClick={() => scheduleCall(app.prospect_id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Llamada
                          </button>
                        )}
                        <FriendsModal prospect={{ id: app.prospect_id, name: app.prospect_name }} />
                      </div>
                      {/* Formulario reagendar debajo */}
                      {showRescheduleFor === app.id && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="datetime-local"
                            value={rescheduleDate}
                            onChange={e => setRescheduleDate(e.target.value)}
                            className="flex-1 bg-gray-700 text-gray-100 border border-gray-600 rounded px-2 py-1"
                          />
                          <input
                            type="text"
                            value={rescheduleAddress}
                            onChange={e => setRescheduleAddress(e.target.value)}
                            className="flex-1 bg-gray-700 text-gray-100 border border-gray-600 rounded px-2 py-1"
                            placeholder="Dirección"
                          />
                          <button
                            onClick={() => confirmReschedule(app.prospect_id)}
                            disabled={!rescheduleDate}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setShowRescheduleFor(null)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-400">No hay citas para este día.</p>
              )}
            </div>
          </div>

      {/* Estilos globales para react-calendar en modo oscuro */}
      <style jsx global>{`
        .react-calendar {
          border: none;
        }
        .react-calendar__navigation button {
          color: #d1d5db;
          background: transparent;
        }
        .react-calendar__navigation button:disabled {
          opacity: 0.5;
        }
        .react-calendar__month-view__weekdays {
          color: #9ca3af;
        }
        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
        }
      `}</style>
      <style jsx global>{`
  /* Fondo del calendario igual que el de tu página (o un pelín más claro) */
  .react-calendar {
    background-color: #1f2937;   /* Tailwind: gray-800 */
    color: #d1d5db;              /* Tailwind: gray-300 para los textos */
    border: none;
  }

  /* Cada casilla en gris oscuro, con texto claro */
  .react-calendar__tile {
    background-color: #1f2937 !important;
    color: #d1d5db !important;
  }

  /* Hover para que destaque ligeramente */
  .react-calendar__tile:enabled:hover {
    background-color: #374151 !important; /* gray-700 */
  }

  /* Día activo/seleccionado */
  .react-calendar__tile--active {
    background: #2563eb !important;       /* azul vivo */
    color: #fafafa !important;
  }

  /* Nombres de los días de la semana */
  .react-calendar__month-view__weekdays__weekday {
    color: #9ca3af; /* gray-400 */
  }

  /* Flechas y mes/año */
  .react-calendar__navigation button {
    color: #f3f4f6;    /* gray-100 */
    background: transparent;
  }
  .react-calendar__navigation__label {
    color: #f3f4f6;    /* gray-100 */
  }
`}</style>

    </div>
    </Layout>
    </ProtectedRoute>
  )
}
