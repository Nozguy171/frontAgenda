// frontend/src/components/HistoryModal.tsx
'use client'
import React from 'react'
import { ProspectHistory, HistoryEntry } from './HistoryCard'

export default function HistoryModal({
  prospect,
  statusLabels,
  open,
  onClose
}: {
  prospect: ProspectHistory
  statusLabels: Record<string, string>
  open: boolean
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay solo con blur, sin oscurecer */}
      <div
        className="absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-800 text-gray-100 p-6 rounded-lg w-full max-w-lg z-10 overflow-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl leading-none"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {prospect.name} — Historial
        </h2>
        <ul className="space-y-3">
          {prospect.history.length > 0 ? (
            prospect.history.map((h: HistoryEntry, i: number) => {
              const oldKey = h.old_status.replace(/\u2011/g, '-')
              const newKey = h.new_status.replace(/\u2011/g, '-')
              return (
                <li key={i} className="bg-gray-700 p-3 rounded">
                  <p className="text-sm">
                    <span className="font-medium">De:</span>{' '}
                    {h.old_status
                      ? statusLabels[oldKey] || h.old_status
                      : '—'}{' '}
                    <span className="font-medium">a:</span>{' '}
                    {statusLabels[newKey] || h.new_status}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(h.changed_at + 'Z').toLocaleString()} —{' '}
                    {h.changed_by?.username || 'Sistema'}
                  </p>
                </li>
              )
            })
          ) : (
            <p className="italic text-gray-400">Sin movimientos</p>
          )}
        </ul>
      </div>
    </div>
  )
}
