'use client'
import React, { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import HistoryCard, { ProspectHistory } from './HistoryCard'
import HistoryModal from './HistoryModal'

interface HistorySectionProps {
  statusLabels: Record<string, string>
}

export default function HistorySection({ statusLabels }: HistorySectionProps) {
  const [list, setList] = useState<ProspectHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ProspectHistory | null>(null)

  useEffect(() => {
    apiFetch('/history')
      .then((data: ProspectHistory[]) => setList(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <span className="text-lg">Cargando historial…</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Historial de Prospectos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(p => (
            <HistoryCard
              key={p.prospect_id}
              prospect={p}
              onOpen={() => setSelected(p)}
            />
          ))}
        </div>
      </div>
      {selected && (
        <HistoryModal
          prospect={selected}
          statusLabels={statusLabels}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
