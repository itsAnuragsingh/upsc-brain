"use client"

import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center text-white p-8">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to UPSC Prep AI</h1>
          <p className="text-xl mb-12">
            Your AI-powered companion for UPSC preparation. Personalized study plans, real-time exam simulations, intelligent document analysis, and performance tracking.
          </p>
          <div className="space-x-4">
            <Button>
            <Link href="/dashboard">Login</Link>
            </Button>
            <Button>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

