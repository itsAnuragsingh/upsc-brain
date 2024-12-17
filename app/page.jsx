"use client"



import { IntroNav } from '@/components/IntroNav';
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react'
import Link from 'next/link'
import { useEffect } from 'react';


export default function Home() {
  const {user} = useUser();
 
  const createUser = useMutation(api.user.createUser);
  
  const checkUser = async()=>{
   const result= await createUser({
     userName: user?.fullName,
     email:user?.emailAddresses[0].emailAddress,
     imageUrl:user?.imageUrl
    }) 
  }
 
  useEffect(() => {
    user && checkUser();
  }, [user])
  return (
    <div className="min-h-screen flex flex-col">
      <IntroNav/>
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

