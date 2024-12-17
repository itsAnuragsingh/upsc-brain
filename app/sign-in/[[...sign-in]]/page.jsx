import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left column - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image 
          src="/login.jpg" 
          alt="login background" 
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Right column - Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-xl scale-110">
          <SignIn />
        </div>
      </div>
    </div>
  )
}