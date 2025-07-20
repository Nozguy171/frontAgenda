'use client'
import { useState } from 'react'
import { apiFetch } from '../services/api'

export default function AddProspectForm({ onAdd }: { onAdd: (p: any) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [observation, setObservation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newP = await apiFetch('/prospects', {
        method: 'POST',
        body: JSON.stringify({ name, phone, observation })
      })
      onAdd(newP)
      setName('')
      setPhone('')
      setObservation('')
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        className="bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded px-3 py-2 flex-1"
        required
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded px-3 py-2 flex-1"
        required
      />
      <input
        type="text"
        placeholder="Observaciones"
        value={observation}
        onChange={e => setObservation(e.target.value)}
        className="bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded px-3 py-2 flex-1"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >Añadir</button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </form>
  )
}