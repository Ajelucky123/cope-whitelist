import type { Metadata } from 'next'
import './globals.css'
import FloatingBackground from '@/components/FloatingBackground'

export const metadata: Metadata = {
  title: 'COPE - From Pain to Movement',
  description: '$COPE is Live on BNB-chain, transforming losses into laughter, setbacks into shared wisdom, and collective pain into a movement spreading hope, smiles, and pure WTF energy across Web3.',
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

