// frontend/src/components/layout.tsx
'use client'
import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/prospectos',    label: 'Prospectos' },
    { href: '/citas',         label: 'Citas' },
    { href: '/seguimiento',   label: 'Seguimiento' },
    { href: '/rechazados',    label: 'Rechazados' },
    { href: '/anexados',      label: 'Anexados' },
    { href: '/historial',     label: 'Historial' },
    { href: '/llamadas',      label: 'Llamadas' },
    { href: '/colaboradores', label: 'Colaboradores' },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {mounted && (
        <>
          {/* HEADER MÓVIL */}
          <header className="flex items-center p-4 bg-gray-800 text-white md:hidden">
            <button onClick={() => setShowSidebar(true)} aria-label="Abrir menú">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="mx-auto font-semibold text-lg">Mi App</span>
          </header>

          {/* SIDEBAR / DRAWER */}
<aside
  className={`fixed inset-y-0 left-0 bg-gray-800 text-gray-200 w-60 p-6
              h-screen overflow-y-auto transform z-50
              transition-transform duration-300 ease-in-out
              md:translate-x-0 md:transition-none
              ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
  style={{
    paddingBottom: 'env(safe-area-inset-bottom)', // asegura espacio abajo en iOS/Android
  }}
>
            <div className="flex flex-col h-full">
              {/* Cerrar menú en móvil */}
              <div className="md:hidden flex justify-end mb-4">
                <button onClick={() => setShowSidebar(false)} aria-label="Cerrar menú">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ul className="space-y-2">
                {navItems.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-4 py-2 rounded transition-colors
                                    ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                        onClick={() => setShowSidebar(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Logout button at bottom */}
              <div className="mt-auto pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
                  </svg>
                  <span className="ml-2">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </aside>

          {/* BACKDROP MÓVIL (transparente) */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-transparent md:hidden z-40"
              onClick={() => setShowSidebar(false)}
            />
          )}
        </>
      )}

<main className="flex-1 w-full bg-gray-900 text-gray-100 ml-0 md:ml-60">
  {children}
</main>

    </div>
  )
}
