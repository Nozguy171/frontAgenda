'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/services/api'

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export default function LlamadasSection() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch('/calls')
        const enriched = await Promise.all(
          data.map(async (c: any) => {
            // Backend already envía los datos de prospecto
            return c
          })
        )
        // Ordenar
        enriched.sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
        setCalls(enriched)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <span className="text-lg">Cargando llamadas…</span>
      </div>
    )
  }

  const today0 = startOfToday()
  // Filtrar por búsqueda y fechas
  const filtered = calls.filter(c =>
    c.prospect_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const pending = filtered.filter(c => new Date(c.scheduled_for) >= today0)

  const renderSection = (title: string, list: any[]) => (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {list.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(c => (
            <div key={c.id} className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{c.prospect_name}</h3>
              <p className="text-sm mb-1">Tel: {c.prospect_phone}</p>
              <p className="text-sm italic mb-2 text-gray-400">
                “{c.prospect_observation || 'Sin observaciones'}”
              </p>
              <p className="text-gray-300">
                Fecha y hora: {new Date(c.scheduled_for).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-400">No hay llamadas en esta sección.</p>
      )}
    </section>
  )

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Llamadas Programadas</h1>
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar prospecto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded px-3 py-2 flex-1"
        />
      </div>
      {renderSection('Pendientes', pending)}
      {renderSection('Todas las llamadas', filtered)}
    </div>
  )
}
