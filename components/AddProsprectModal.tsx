// frontend/src/components/AddProspectModal.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '../services/api'

export default function AddProspectModal({ onAdd }: { onAdd: (p: any) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [observation, setObservation] = useState('')
  const [recomendadoTerm, setRecomendadoTerm] = useState('')
  const [noRecomendacion, setNoRecomendacion] = useState(false)
  const [recomendadoPorOptions, setRecomendadoPorOptions] = useState<any[]>([])
  const [recomendadoPorId, setRecomendadoPorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)

  // Autocomplete "Recomendado por"
  useEffect(() => {
    if (!recomendadoTerm || noRecomendacion) {
      setRecomendadoPorOptions([])
      if (!noRecomendacion) setRecomendadoPorId(null)
      return
    }
    ;(async () => {
      try {
        const results = await apiFetch(
          `/prospects?search=${encodeURIComponent(recomendadoTerm)}`
        )
        setRecomendadoPorOptions(results)
      } catch {
        setRecomendadoPorOptions([])
      }
    })()
  }, [recomendadoTerm, noRecomendacion])

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRecomendadoPorOptions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const resetForm = () => {
    setName('')
    setPhone('')
    setObservation('')
    setRecomendadoTerm('')
    setNoRecomendacion(false)
    setRecomendadoPorId(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || (!recomendadoPorId && !noRecomendacion)) return
    try {
      const payload: any = { name, phone, observation }
      if (!noRecomendacion && recomendadoPorId) payload.recomendadoPorId = recomendadoPorId
      const newP = await apiFetch('/prospects', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      onAdd(newP)
      resetForm()
      setShowModal(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Agregar Prospecto
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay con blur */}
          <div
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
            onClick={() => { resetForm(); setShowModal(false) }}
          />

          {/* Modal content */}
          <div className="relative bg-gray-800 text-gray-100 p-6 rounded-lg w-full max-w-md z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nuevo Prospecto</h2>
              <button
                onClick={() => { resetForm(); setShowModal(false) }}
                aria-label="Cerrar modal"
                className="text-2xl leading-none"
              >&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-3 py-2 w-full"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                pattern="\d*"
                className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-3 py-2 w-full"
                required
              />

              <textarea
                placeholder="Observaciones"
                value={observation}
                onChange={e => setObservation(e.target.value)}
                className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-3 py-2 w-full h-20 resize-none"
              />

              <fieldset className="flex items-center gap-2">
                <input
                  id="noRecomendado"
                  type="checkbox"
                  checked={noRecomendacion}
                  onChange={e => {
                    setNoRecomendacion(e.target.checked)
                    if (e.target.checked) {
                      setRecomendadoTerm('')
                      setRecomendadoPorId(null)
                    }
                  }}
                  className="h-4 w-4 text-green-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="noRecomendado" className="text-gray-200">
                  No fue recomendado por nadie
                </label>
              </fieldset>

              {!noRecomendacion && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Recomendado por"
                    value={recomendadoTerm}
                    onChange={e => { setRecomendadoTerm(e.target.value); setRecomendadoPorId(null) }}
                    className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-3 py-2 w-full"
                    required
                  />
                  {recomendadoPorOptions.length > 0 && (
                    <ul
                      ref={dropdownRef}
                      className="absolute z-20 bg-gray-700 border border-gray-600 rounded mt-1 w-full max-h-40 overflow-auto"
                    >
                      {recomendadoPorOptions.map(opt => (
                        <li
                          key={opt.id}
                          className="px-3 py-2 hover:bg-gray-600 cursor-pointer"
                          onClick={() => {
                            setRecomendadoTerm(opt.name)
                            setRecomendadoPorId(opt.id)
                            setRecomendadoPorOptions([])
                          }}
                        >{opt.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!name || !phone || (!recomendadoPorId && !noRecomendacion)}
                className={`px-4 py-2 rounded text-white transition ${
                  !name || !phone || (!recomendadoPorId && !noRecomendacion)
                    ? 'bg-green-500/50 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-400'
                }`}
              >
                Añadir
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
