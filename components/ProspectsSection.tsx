// frontend/src/components/ProspectsSection.tsx
'use client'
import { useState, useEffect } from 'react'
import ProspectCard from './ProspectCard'
import AddProspectModal from './AddProsprectModal'
import { apiFetch } from '../services/api'

export default function ProspectsSection() {
  const [prospects, setProspects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchList = async () => {
    const list = await apiFetch(
      `/prospects?search=${encodeURIComponent(searchTerm)}`
    )
    setProspects(list)
  }

  useEffect(() => {
    fetchList()
  }, [searchTerm])

  const handleAdd = (p: any) => setProspects(prev => [p, ...prev])
  const handleUpdate = (p: any) =>
    setProspects(prev => prev.map(x => (x.id === p.id ? p : x)))

  // Normaliza estados cambiando guiones no ASCII por ASCII
  const normalize = (s: string) => s.replace(/\u2011/g, '-')

  const pendientes = prospects.filter(
    p => normalize(p.status) === 'pending'
  )
  const sinRespuesta = prospects.filter(
    p => normalize(p.status) === 'no-response'
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Prospectos</h1>
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              placeholder="Buscar prospecto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={fetchList}
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </div>
          <div className="flex-1">
            <AddProspectModal onAdd={handleAdd} />
          </div>
        </div>

        {/* Pendientes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pendientes</h2>
          {pendientes.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendientes.map(p => (
                <ProspectCard
                  key={p.id}
                  prospect={p}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          ) : (
            <p className="italic text-gray-400">No hay prospectos pendientes.</p>
          )}
        </section>

        {/* Sin respuesta */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Sin respuesta</h2>
          {sinRespuesta.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sinRespuesta.map(p => (
                <ProspectCard
                  key={p.id}
                  prospect={p}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          ) : (
            <p className="italic text-gray-400">
              No hay prospectos sin respuesta.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
