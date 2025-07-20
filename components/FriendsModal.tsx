// frontend/src/components/FriendsModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'

export default function FriendsModal({ prospect }: { prospect: any }) {
  const [open, setOpen] = useState(false)
  const [recommendedBy, setRecommendedBy] = useState<{ id: number; name: string } | null>(null)
  const [referred, setReferred] = useState<{ id: number; name: string }[]>([])
  // Iniciamos abiertos
  const [showRecommendedBy, setShowRecommendedBy] = useState(true)
  const [showReferred, setShowReferred] = useState(true)

  // Fetch recommendations when modal opens
  useEffect(() => {
    if (!open) return
    apiFetch(`/prospects/${prospect.id}/friends`)
      .then(data => {
        setRecommendedBy(data.recommended_by)
        setReferred(data.referred)
      })
      .catch(() => {
        setRecommendedBy(null)
        setReferred([])
      })
  }, [open, prospect.id])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
      >
        Ver recomendaciones
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay con solo blur */}
          <div
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative bg-gray-800 text-gray-100 p-6 rounded-lg w-full max-w-md z-10">
            {/* Cerrar */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-2xl leading-none"
              aria-label="Cerrar modal"
            >&times;</button>
            <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>

            {/* Recomendado por texto clickeable */}
            <div className="mb-4">
              <div
                className="flex justify-between items-center text-blue-400 underline cursor-pointer"
                onClick={() => setShowRecommendedBy(prev => !prev)}
              >
                <span>Recomendado por ({recommendedBy ? 1 : 0})</span>
                <span className="ml-2">{showRecommendedBy ? '∨' : '−'}</span>
              </div>
              {showRecommendedBy && (
                <div className="mt-2 pl-4">
                  {recommendedBy ? (
                    <p className="text-gray-200">{recommendedBy.name}</p>
                  ) : (
                    <p className="italic text-gray-400">Nadie</p>
                  )}
                </div>
              )}
            </div>

            {/* Referidos texto clickeable */}
            <div>
              <div
                className="flex justify-between items-center text-blue-400 underline cursor-pointer"
                onClick={() => setShowReferred(prev => !prev)}
              >
                <span>Recomendados ({referred.length})</span>
                <span className="ml-2">{showReferred ? '∨' : '−'}</span>
              </div>
              {showReferred && (
                <div className="mt-2 pl-4 space-y-1">
                  {referred.length > 0 ? (
                    referred.map(r => (
                      <p key={r.id} className="text-gray-200">{r.name}</p>
                    ))
                  ) : (
                    <p className="italic text-gray-400">No ha recomendado a nadie</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
