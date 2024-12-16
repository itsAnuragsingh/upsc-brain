'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'

export default function StudyPlan() {
  const [plan, setPlan] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [date, setDate] = useState(new Date())

  const generatePlan = () => {
    // This is where you'd integrate with an AI service
    setPlan(`Here's your personalized study plan for ${subject} over ${duration}:

1. Week 1-2: Foundation and Basic Concepts
   - Study key theories and principles
   - Review important historical events
   - Practice basic problem-solving techniques

2. Week 3-4: Advanced Topics and Analysis
   - Dive deep into complex subjects
   - Analyze case studies and real-world applications
   - Begin mock test preparations

3. Week 5-6: Revision and Practice
   - Revise all major topics
   - Take full-length practice tests
   - Focus on weak areas identified in mock tests

Remember to take regular breaks and stay consistent with your study schedule!`)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">AI Study Plan Generator</h1>
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Plan</TabsTrigger>
          <TabsTrigger value="view">View Current Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Your Personalized Study Plan</CardTitle>
              <CardDescription>Select your subject and study duration to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Select onValueChange={setSubject}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="polity">Polity</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={setDuration}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generatePlan} className="mb-4" disabled={!subject || !duration}>Generate Study Plan</Button>
              <Textarea 
                value={plan} 
                readOnly 
                className="w-full h-[400px]"
                placeholder="Your personalized study plan will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Study Plan</CardTitle>
                <CardDescription>Your active study schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">History - 3 Month Plan</h3>
                <p className="mb-4">Week 3: Advanced Topics and Analysis</p>
                <Progress value={33} className="mb-2" />
                <p className="text-sm text-muted-foreground">33% Complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
                <CardDescription>Track your study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

