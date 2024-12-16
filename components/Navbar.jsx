import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              UPSC Prep AI
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

