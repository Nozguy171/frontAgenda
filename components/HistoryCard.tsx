'use client'
import React from 'react'

export interface HistoryEntry {
  old_status: string
  new_status: string
  changed_at: string
  changed_by: { id: number; username: string } | null
}

export interface ProspectHistory {
  prospect_id: number
  name: string
  phone: string
  observation: string
  history: HistoryEntry[]
}

export default function HistoryCard({
  prospect,
  onOpen
}: {
  prospect: ProspectHistory
  onOpen: () => void
}) {
  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{prospect.name}</h3>
        <p className="text-sm">Tel: {prospect.phone}</p>
        {prospect.observation && (
          <p className="text-sm italic text-gray-400">“{prospect.observation}”</p>
        )}
        <p className="text-xs mt-1 text-gray-400">
          Movimientos: {prospect.history.length}
        </p>
      </div>
      <button
        onClick={onOpen}
        className="text-blue-400 underline hover:text-blue-300"
      >
        Ver historial
      </button>
    </div>
  )
}
