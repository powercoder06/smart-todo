// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const pathname = usePathname()

  // nav items to render
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/context', label: 'Context' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Smart Todo
        </h1>
        <nav className="flex items-center space-x-6">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative px-1 py-1 text-gray-600 dark:text-gray-300
                  hover:text-gray-900 dark:hover:text-white transition
                  focus:outline-none focus:ring-2 focus:ring-blue-400 rounded
                  ${isActive
                    ? 'font-semibold text-gray-900 dark:text-white before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-blue-600 dark:before:bg-blue-400'
                    : ''}
                `}
              >
                {label}
              </Link>
            )
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
