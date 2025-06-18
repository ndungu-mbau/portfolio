'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cva } from 'class-variance-authority'
import { useMediaQuery } from 'react-responsive'
import { navItems } from '~/lib/nav-items'

interface SidebarProps {
  collapsed: boolean
}

const sidebarClasses = cva(
  'h-screen bg-neutral-900 text-white transition-all duration-300 ease-in-out',
  {
    variants: {
      collapsed: {
        true: 'w-32',
        false: 'w-64',
      },
    },
  }
)

const linkClasses = cva('flex items-center m-2 rounded-lg p-4 align-middle', {
  variants: {
    active: {
      true: 'bg-neutral-800',
      false: 'hover:bg-neutral-800',
    },
    collapsed: {
      true: 'justify-center',
      false: 'justify-start',
    },
  },
})

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()
  const isMediumScreen = useMediaQuery({ minWidth: 768 })

  return (
    <aside className={sidebarClasses({ collapsed })}>
      <nav className="mt-12 flex flex-col justify-center p-4">
        <div className="flex h-0 w-0 justify-center md:h-32 md:w-32 md:pb-4">
          <Image
            src="/logo.svg"
            alt="logo"
            height={isMediumScreen ? 64 : 0}
            width={isMediumScreen ? 96 : 0}
          />
        </div>
        <hr className="hidden md:block md:py-4" />
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClasses({
              active: pathname === item.href,
              collapsed,
            })}
          >
            <item.icon className="h-6 w-6" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
        <div
          className={linkClasses({
            active: false,
            collapsed,
          })}
        >
          <p>Nelson Mbau</p>
        </div>
      </nav>
    </aside>
  )
}
