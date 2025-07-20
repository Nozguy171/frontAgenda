'use client'
import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/prospectos" className="text-xl font-bold hover:text-white">
          VentasApp
        </Link>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <Link href="/prospectos" className="hover:text-white">
            Prospectos
          </Link>
          <Link href="#" className="hover:text-white opacity-50 cursor-not-allowed">
            Citas
          </Link>
          <Link href="#" className="hover:text-white opacity-50 cursor-not-allowed">
            Seguimiento
          </Link>
        </div>
      </div>
    </nav>
  )
}