import type { Metadata } from 'next'
import './globals.css'
import FloatingBackground from '@/components/FloatingBackground'

export const metadata: Metadata = {
  title: 'COPE PAIN Whitelist',
  description: 'Join the COPE PAIN Whitelist and rank up through referrals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FloatingBackground />
        {children}
      </body>
    </html>
  )
}

