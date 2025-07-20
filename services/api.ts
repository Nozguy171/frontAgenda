// frontend/src/services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://backagenda-production.up.railway.app/'

export async function apiFetch(path: string, opts: RequestInit = {}) {
  // Obtener token JWT del localStorage (solo en cliente)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Construir headers, incluyendo Authorization si existe token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Ejecutar fetch con headers y demás opciones
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} — ${text}`)
  }
  return res.json()
}
