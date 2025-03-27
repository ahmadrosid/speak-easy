"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Mic, Play, Square, Volume2, Loader2, Plus } from "lucide-react"
import { generateSpeech, generatePronunciationExercise } from "@/app/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Initial pronunciation exercises
const initialPronunciationExercises = [
  {
    id: "th",
    title: "TH Sound Practice",
    description: 'Practice the "th" sound in English, which can be voiced (as in "the") or unvoiced (as in "think").',
    examples: [
      { text: "Think", phonetic: "/θɪŋk/" },
      { text: "The", phonetic: "/ðə/" },
      { text: "Three", phonetic: "/θriː/" },
      { text: "Mother", phonetic: "/ˈmʌðər/" },
      { text: "Both", phonetic: "/boʊθ/" },
    ],
  },
  {
    id: "r",
    title: "R Sound Practice",
    description: 'Practice the English "r" sound, which is different from many other languages.',
    examples: [
      { text: "Red", phonetic: "/rɛd/" },
      { text: "Very", phonetic: "/ˈvɛri/" },
      { text: "Around", phonetic: "/əˈraʊnd/" },
      { text: "Bright", phonetic: "/braɪt/" },
      { text: "Grow", phonetic: "/ɡroʊ/" },
    ],
  },
  {
    id: "vowels",
    title: "Vowel Sounds",
    description: "Practice the various vowel sounds in English.",
    examples: [
      { text: "Seat", phonetic: "/siːt/" },
      { text: "Sit", phonetic: "/sɪt/" },
      { text: "Set", phonetic: "/sɛt/" },
      { text: "Sat", phonetic: "/sæt/" },
      { text: "Sought", phonetic: "/sɔːt/" },
    ],
  },
]

// Levels for the custom exercise generator
const levels = [
  { id: "beginner", name: "Beginner (A1-A2)" },
  { id: "intermediate", name: "Intermediate (B1-B2)" },
  { id: "advanced", name: "Advanced (C1-C2)" },
]

export default function PronunciationPage() {
  const [pronunciationExercises, setPronunciationExercises] = useState(initialPronunciationExercises)
  const [selectedExercise, setSelectedExercise] = useState(pronunciationExercises[0])
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [selectedExample, setSelectedExample] = useState(selectedExercise.examples[0])
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGeneratingExercise, setIsGeneratingExercise] = useState(false)
  const [soundToGenerate, setSoundToGenerate] = useState("")
  const [levelToGenerate, setLevelToGenerate] = useState("intermediate")
  const [generationError, setGenerationError] = useState<string | null>(null)

  const audioChunks = useRef<BlobPart[]>([])

  useEffect(() => {
    setSelectedExample(selectedExercise.examples[0])
    setAudioURL(null)
    setFeedback(null)
  }, [selectedExercise])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      audioChunks.current = []

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)

        // In a real app, you would send this audio to your API for analysis
        setLoading(true)
        analyzePronunciationMock(selectedExample.text).then((result) => {
          setFeedback(result)
          setLoading(false)
        })
      }

      setMediaRecorder(recorder)
      recorder.start()
      setRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  // Mock function to simulate pronunciation analysis
  const analyzePronunciationMock = async (text: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate random score between 70 and 95
    const score = Math.floor(Math.random() * 26) + 70

    // Progress animation
    for (let i = 0; i <= score; i++) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    return {
      score,
      feedback:
        score > 85
          ? "Excellent pronunciation! Your articulation is very clear."
          : "Good attempt! Try to focus on the position of your tongue and lips.",
      areas_to_improve:
        score > 85
          ? ["Minor intonation adjustments would make it perfect"]
          : ["Focus on the specific sound at the beginning", "Try to elongate the vowel sound more"],
    }
  }

  const playExampleAudio = async () => {
    setIsPlayingAudio(true)
    try {
      const result = await generateSpeech(selectedExample.text)
      const audio = new Audio(`data:audio/mpeg;base64,${result.audio}`)
      audio.play()
    } catch (err) {
      console.error("Error playing example audio:", err)
    } finally {
      setIsPlayingAudio(false)
    }
  }

  const handleGenerateExercise = async () => {
    if (!soundToGenerate.trim()) {
      setGenerationError("Please enter a sound or feature to practice")
      return
    }

    setIsGeneratingExercise(true)
    setGenerationError(null)

    try {
      const newExercise = await generatePronunciationExercise(soundToGenerate, levelToGenerate)

      // Add the new exercise to the list
      setPronunciationExercises((prev) => [...prev, newExercise])

      // Select the new exercise
      setSelectedExercise(newExercise)

      // Close the dialog
      setIsDialogOpen(false)

      // Reset the form
      setSoundToGenerate("")
    } catch (error) {
      console.error("Error generating exercise:", error)
      setGenerationError(error.message || "Failed to generate exercise. Please try again.")
    } finally {
      setIsGeneratingExercise(false)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pronunciation Practice</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Exercise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Pronunciation Exercise</DialogTitle>
              <DialogDescription>
                Generate a new pronunciation exercise focused on a specific sound or feature.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sound">Sound or Feature to Practice</Label>
                <Input
                  id="sound"
                  placeholder="e.g., 'th sound', 'r vs l', 'word stress'"
                  value={soundToGenerate}
                  onChange={(e) => setSoundToGenerate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={levelToGenerate} onValueChange={setLevelToGenerate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {generationError && <div className="text-sm text-red-500">{generationError}</div>}
            </div>

            <DialogFooter>
              <Button onClick={handleGenerateExercise} disabled={isGeneratingExercise || !soundToGenerate.trim()}>
                {isGeneratingExercise ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Exercise"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={selectedExercise.id}
        onValueChange={(value) => {
          const exercise = pronunciationExercises.find((ex) => ex.id === value)
          if (exercise) setSelectedExercise(exercise)
        }}
      >
        <TabsList className="mb-8 flex flex-wrap">
          {pronunciationExercises.map((exercise) => (
            <TabsTrigger key={exercise.id} value={exercise.id}>
              {exercise.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {pronunciationExercises.map((exercise) => (
          <TabsContent key={exercise.id} value={exercise.id}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{exercise.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {exercise.examples.map((example, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer ${selectedExample === example ? "border-primary" : ""}`}
                      onClick={() => {
                        setSelectedExample(example)
                        setAudioURL(null)
                        setFeedback(null)
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="text-xl font-medium mb-2">{example.text}</div>
                        <div className="text-sm font-mono text-muted-foreground">{example.phonetic}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{selectedExample.text}</h3>
                        <p className="text-sm font-mono text-muted-foreground">{selectedExample.phonetic}</p>
                      </div>
                      <Button variant="outline" size="icon" onClick={playExampleAudio} disabled={isPlayingAudio}>
                        {isPlayingAudio ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      {recording ? (
                        <Button variant="destructive" onClick={stopRecording}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      ) : (
                        <Button onClick={startRecording}>
                          <Mic className="h-4 w-4 mr-2" />
                          Record Your Pronunciation
                        </Button>
                      )}

                      {audioURL && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const audio = new Audio(audioURL)
                            audio.play()
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Recording
                        </Button>
                      )}
                    </div>
                  </div>

                  {loading && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Analyzing your pronunciation...</p>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {feedback && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Pronunciation Feedback</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold">{feedback.score}/100</div>
                          <Progress value={feedback.score} className="h-2 flex-1" />
                        </div>

                        <p>{feedback.feedback}</p>

                        {feedback.areas_to_improve.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Areas to Improve:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {feedback.areas_to_improve.map((area: string, index: number) => (
                                <li key={index} className="text-sm">
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

