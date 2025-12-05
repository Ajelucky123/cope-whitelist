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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <FloatingBackground />
        {children}
      </body>
    </html>
  )
}

