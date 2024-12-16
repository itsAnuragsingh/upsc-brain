'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Timer, AlertCircle } from 'lucide-react'

export default function ExamSimulation() {
  const [webcamActive, setWebcamActive] = useState(false)
  const [examStarted, setExamStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 hours in minutes

  const toggleWebcam = () => {
    setWebcamActive(!webcamActive)
    // Here you'd implement actual webcam functionality
  }

  const startExam = () => {
    setExamStarted(true)
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 60000) // Update every minute
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Exam Simulation</h1>
      <Tabs defaultValue="exam" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exam">Current Exam</TabsTrigger>
          <TabsTrigger value="history">Exam History</TabsTrigger>
        </TabsList>
        <TabsContent value="exam">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Exam Area</CardTitle>
                <CardDescription>Your exam questions and answer sheet</CardDescription>
              </CardHeader>
              <CardContent>
                {examStarted ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-lg py-1">
                        <Timer className="mr-2 h-4 w-4" />
                        Time Left: {formatTime(timeLeft)}
                      </Badge>
                      <Badge variant="destructive">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Do not refresh the page
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Question 1:</h3>
                        <p className="mb-2">Explain the concept of judicial review in the Indian context and discuss its significance in maintaining the balance of power between different branches of government.</p>
                        <Textarea className="mt-2" rows={6} placeholder="Type your answer here..." />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Question 2:</h3>
                        <p className="mb-2">Analyze the impact of the Green Revolution on Indian agriculture and its socio-economic consequences.</p>
                        <Textarea className="mt-2" rows={6} placeholder="Type your answer here..." />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-4">Click the button below to start your exam simulation.</p>
                    <Button onClick={startExam} size="lg">
                      Start Exam
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Webcam Feed</CardTitle>
                <CardDescription>Simulates exam environment monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md mb-4">
                  {webcamActive ? 'Webcam Active' : 'Webcam Inactive'}
                </div>
                <Button onClick={toggleWebcam} className="w-full">
                  {webcamActive ? 'Stop Webcam' : 'Start Webcam'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Previous Exams</CardTitle>
              <CardDescription>Your exam history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Mock UPSC Prelims 2023</p>
                    <p className="text-sm text-muted-foreground">Taken on: 15th August 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Score: 120/200</p>
                    <Progress value={60} className="w-[100px]" />
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">General Studies Paper I</p>
                    <p className="text-sm text-muted-foreground">Taken on: 1st July 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Score: 85/150</p>
                    <Progress value={57} className="w-[100px]" />
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

