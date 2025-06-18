import type React from 'react'
import FloatingNavbar from '~/components/floating-navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  )
}
