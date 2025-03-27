"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Calendar, Clock, Award } from "lucide-react"

// Mock data for user progress
const mockUserProgress = {
  streak: 7,
  totalPracticeTime: 320, // minutes
  wordsLearned: 142,
  pronunciationScore: 82,
  practiceHistory: [
    { date: "2025-03-21", minutes: 15, score: 78 },
    { date: "2025-03-22", minutes: 25, score: 80 },
    { date: "2025-03-23", minutes: 30, score: 79 },
    { date: "2025-03-24", minutes: 20, score: 81 },
    { date: "2025-03-25", minutes: 35, score: 83 },
    { date: "2025-03-26", minutes: 40, score: 85 },
    { date: "2025-03-27", minutes: 45, score: 87 },
  ],
  topicProgress: [
    { topic: "Daily Conversations", progress: 75 },
    { topic: "Travel & Tourism", progress: 60 },
    { topic: "Business English", progress: 45 },
    { topic: "Academic Discussions", progress: 30 },
    { topic: "Social Situations", progress: 65 },
  ],
  pronunciationProgress: [
    { sound: "TH Sound", progress: 85 },
    { sound: "R Sound", progress: 70 },
    { sound: "Vowel Sounds", progress: 75 },
    { sound: "L vs R", progress: 65 },
    { sound: "Word Stress", progress: 80 },
  ],
}

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState(mockUserProgress)

  // In a real app, you would fetch user progress data from your API
  useEffect(() => {
    // Simulate API call
    const fetchUserProgress = async () => {
      // In a real app, this would be an API call
      setUserProgress(mockUserProgress)
    }

    fetchUserProgress()
  }, [])

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.totalPracticeTime} mins</div>
            <p className="text-xs text-muted-foreground">Total practice time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.wordsLearned}</div>
            <p className="text-xs text-muted-foreground">Vocabulary expansion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pronunciation</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.pronunciationScore}/100</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Practice</CardTitle>
              <CardDescription>Your practice sessions over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium mb-2">Practice Time (minutes)</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {userProgress.practiceHistory.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="h-24 w-full bg-muted rounded-md relative">
                          <div
                            className="absolute bottom-0 w-full bg-primary rounded-md"
                            style={{ height: `${(day.minutes / 45) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-2">
                          {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Pronunciation Score</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {userProgress.practiceHistory.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="h-24 w-full bg-muted rounded-md relative">
                          <div
                            className="absolute bottom-0 w-full bg-primary rounded-md"
                            style={{ height: `${day.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-2">
                          {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>Topic Progress</CardTitle>
              <CardDescription>Your progress across different conversation topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.topicProgress.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{topic.topic}</span>
                      <span className="text-sm text-muted-foreground">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pronunciation">
          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Progress</CardTitle>
              <CardDescription>Your progress with different sounds and pronunciation skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.pronunciationProgress.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.sound}</span>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

