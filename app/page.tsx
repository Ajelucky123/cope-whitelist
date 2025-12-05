'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const contractAddress = 'CA - coming soon' // Replace with actual contract

  const copyContract = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(id)
      // Close mobile menu after navigating
      setMobileOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative z-10">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b border-cope-orange border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/images/image.png" 
                alt="COPE Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-black text-white">COPE</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-cope-orange transition font-semibold"
              >
                ABOUT
              </button>
              <button
                onClick={() => scrollToSection('tokenomics')}
                className="text-white hover:text-cope-orange transition font-semibold"
              >
                TOKENOMICS
              </button>
              <button
                onClick={() => scrollToSection('howtobuy')}
                className="text-white hover:text-cope-orange transition font-semibold"
              >
                HOW TO BUY
              </button>
              <Link
                href="/whitelist"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-cope-orange text-black font-bold rounded-lg hover:opacity-90 transition"
              >
                WHITELIST
              </Link>
              <button
                onClick={() => window.open('https://pancakeswap.finance', '_blank')}
                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:opacity-90 transition"
              >
                BUY NOW
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(prev => !prev)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black bg-opacity-95 border-b border-cope-orange border-opacity-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('about')}
              className="text-left text-white hover:text-cope-orange transition font-semibold"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollToSection('tokenomics')}
              className="text-left text-white hover:text-cope-orange transition font-semibold"
            >
              TOKENOMICS
            </button>
            <button
              onClick={() => scrollToSection('howtobuy')}
              className="text-left text-white hover:text-cope-orange transition font-semibold"
            >
              HOW TO BUY
            </button>
            <Link
              href="/whitelist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left px-4 py-2 bg-cope-orange text-black font-bold rounded-lg hover:opacity-90 transition inline-block"
              onClick={() => setMobileOpen(false)}
            >
              WHITELIST
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false)
                window.open('https://pancakeswap.finance', '_blank')
              }}
              className="text-left px-4 py-2 bg-white text-black font-bold rounded-lg hover:opacity-90 transition inline-block"
            >
              BUY NOW
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Image at Top */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/images/image.png" 
                alt="COPE" 
                className="max-w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Text Below Image */}
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-semibold mb-6 text-white">
              COPE
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8">
              from pain to movement
            </p>
            
            {/* Contract Address */}
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-6 flex items-center gap-3 max-w-2xl mx-auto">
              <span className="font-mono text-sm text-gray-300 flex-1 text-left break-all">
                {contractAddress}
              </span>
              <button
                onClick={copyContract}
                className="px-4 py-2 bg-cope-orange text-black font-bold rounded-lg hover:opacity-90 transition text-sm whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center">
              <a href="#" className="text-white hover:text-cope-orange transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-cope-orange transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cope-orange transition">
                <img 
                  src="/images/dex-screener-logo.png" 
                  alt="DexScreener" 
                  className="w-6 h-6 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diagonal Banner */}
      <div className="py-4 bg-cope-orange bg-opacity-20 border-y border-cope-orange border-opacity-30 overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          <span className="inline-block text-black font-semibold text-xl mx-4">
            COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE
          </span>
          <span className="inline-block text-black font-semibold text-xl mx-4">
            COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE
          </span>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h2 className="text-5xl md:text-7xl font-semibold mb-8 text-white">
                ABOUT COPE
              </h2>
              <div className="space-y-4 text-lg font-semibold text-gray-300">
                <p>Bros are coping hard. They aren't just sharing their pain stories.</p>
                <p>Now $COPE is Live on BNB-chain, transforming losses into laughter, setbacks into shared wisdom, and collective pain into a movement spreading hope, smiles, and pure WTF energy across Web3.</p>
                <p className="text-cope-orange font-semibold">$COPE - the shared pain of crypto bros.</p>
                <p className="text-sm font-semibold text-gray-400">email: support@copehard.xyz</p>
              </div>
            </div>

            {/* Right: Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black bg-opacity-40 p-4 rounded-lg border border-cope-orange border-opacity-20">
                <img 
                  src="/images/image.png" 
                  alt="COPE" 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="bg-black bg-opacity-40 p-4 rounded-lg border border-cope-orange border-opacity-20 mt-8">
                <img 
                  src="/images/image.png" 
                  alt="COPE" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-4 bg-black bg-opacity-60">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image (below on mobile, left on desktop) */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="relative">
                <img 
                  src="/images/image.png" 
                  alt="COPE Tokenomics" 
                  className="max-w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            </div>

            {/* Tokenomics text (above on mobile, right on desktop) */}
            <div className="order-1 md:order-2">
              <h2 className="text-5xl md:text-7xl font-semibold mb-8 text-white">
                TOKENOMICS
              </h2>
              <div className="space-y-6">
                <div className="text-4xl font-semibold text-cope-orange mb-4">
                  100,000,000
                </div>
                <p className="text-xl font-semibold text-gray-300 mb-6">Total Supply</p>
                
                <div className="space-y-3 text-lg font-semibold">
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">32.5%</span>
                    <span className="text-white font-semibold">Airdrop</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">25%</span>
                    <span className="text-white font-semibold">CZ wallet</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">15%</span>
                    <span className="text-white font-semibold">Presale</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">12.5%</span>
                    <span className="text-white font-semibold">Initial LP</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">10%</span>
                    <span className="text-white font-semibold">Marketing</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black bg-opacity-40 rounded-lg border border-cope-orange border-opacity-20">
                    <span className="text-gray-300 font-semibold">5%</span>
                    <span className="text-white font-semibold">Team</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-cope-orange bg-opacity-20 p-4 rounded-lg border border-cope-orange border-opacity-40 text-center">
                    <div className="text-sm font-semibold text-gray-300 mb-2">BUY TAX</div>
                    <div className="text-2xl font-semibold text-cope-orange">5%</div>
                  </div>
                  <div className="bg-cope-orange bg-opacity-20 p-4 rounded-lg border border-cope-orange border-opacity-40 text-center">
                    <div className="text-sm font-semibold text-gray-300 mb-2">SELL TAX</div>
                    <div className="text-2xl font-semibold text-cope-orange">5%</div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-400 mt-4 text-center">
                  Auto buy back & burn every month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section id="howtobuy" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Instructions */}
            <div>
              <h2 className="text-5xl md:text-7xl font-semibold mb-8 text-white">
                HOW TO BUY
              </h2>
              <div className="space-y-6 text-lg font-semibold">
                <div>
                  <div className="text-2xl font-semibold text-cope-orange mb-2">1. Get a Wallet</div>
                  <p className="text-gray-300 font-semibold">Download MetaMask or Trust Wallet.</p>
                  <p className="text-gray-300 font-semibold">Switch network to BNB Smart Chain (BSC).</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-cope-orange mb-2">2. Buy BNB</div>
                  <p className="text-gray-300 font-semibold">Purchase BNB directly in your wallet or through your favorite exchange.</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-cope-orange mb-2">3. Go to PancakeSwap</div>
                  <p className="text-gray-300 font-semibold">Connect wallet → Paste contract →</p>
                  <p className="font-mono text-sm font-semibold text-cope-orange break-all">{contractAddress}</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-cope-orange mb-2">4. Swap</div>
                  <p className="text-gray-300 font-semibold">Select BNB → $COPE, set slippage to 6%+, and hit SWAP.</p>
                </div>
                <p className="text-xl font-semibold text-cope-orange mt-6">
                  Welcome to the COPE movement!
                </p>
              </div>
            </div>

            {/* Right: Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/images/pancakecope.png" 
                  alt="COPE Buy Guide" 
                  className="max-w-full h-auto max-h-[500px] object-contain"
                />
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => window.open('https://pancakeswap.finance', '_blank')}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:opacity-90 transition flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    PancakeSwap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Movement Section */}
      <section className="py-20 px-4 bg-black bg-opacity-60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="py-4 bg-cope-orange bg-opacity-20 border-y border-cope-orange border-opacity-30 overflow-hidden mb-12">
            <div className="flex whitespace-nowrap animate-scroll">
              <span className="inline-block text-white font-semibold text-xl mx-4">
                JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT
              </span>
              <span className="inline-block text-white font-semibold text-xl mx-4">
                JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT • JOIN COPE MOVEMENT
              </span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-white hover:text-cope-orange transition">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-cope-orange transition">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>

          <Link
            href="/whitelist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-gradient-to-r from-cope-orange to-cope-orange-light text-black font-semibold rounded-2xl hover:opacity-90 transition text-xl shadow-[0_0_30px_rgba(255,122,0,0.4)]"
          >
            JOIN COPE PAIN WHITELIST
          </Link>
        </div>
      </section>

      {/* Footer Banner */}
      <div className="py-4 bg-cope-orange bg-opacity-20 border-y border-cope-orange border-opacity-30 overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          <span className="inline-block text-black font-semibold text-xl mx-4">
            COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE
          </span>
          <span className="inline-block text-black font-semibold text-xl mx-4">
            COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE • COPE
          </span>
        </div>
      </div>
    </div>
  )
}
