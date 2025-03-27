"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Mic, BarChart, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Improve Your English with AI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Practice conversations, improve your pronunciation, and track your progress with our AI-powered English
          learning platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Practice Conversations</CardTitle>
            <CardDescription>
              Engage in realistic conversations on various topics with our AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Choose from different topics and difficulty levels to practice your English speaking and comprehension
              skills.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/practice" className="w-full">
              <Button className="w-full">
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Mic className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Pronunciation Training</CardTitle>
            <CardDescription>Perfect your pronunciation with targeted exercises and instant feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Practice specific sounds, record your voice, and get AI-powered feedback to improve your accent.</p>
          </CardContent>
          <CardFooter>
            <Link href="/pronunciation" className="w-full">
              <Button className="w-full">
                Improve Pronunciation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <BarChart className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Track Progress</CardTitle>
            <CardDescription>Monitor your improvement over time with detailed analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View your practice history, pronunciation scores, and vocabulary growth to stay motivated.</p>
          </CardContent>
          <CardFooter>
            <Link href="/progress" className="w-full">
              <Button className="w-full">
                View Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">New Feature: Custom Pronunciation Exercises</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate personalized pronunciation exercises for any sound or feature you want to practice.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href="/pronunciation">
            <Button size="lg">
              Try Custom Exercises
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to improve your English?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Start practicing today and see your English skills improve with our AI-powered learning platform.
        </p>

        <Link href="/practice">
          <Button size="lg">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

