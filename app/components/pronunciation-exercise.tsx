"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Play, Square, Volume2, Loader2 } from "lucide-react"
import { generateSpeech } from "@/app/actions"

interface Example {
  text: string
  phonetic: string
}

interface PronunciationExerciseProps {
  title: string
  description: string
  examples: Example[]
}

export function PronunciationExerciseComponent({ title, description, examples }: PronunciationExerciseProps) {
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [selectedExample, setSelectedExample] = useState(examples[0])
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const audioChunks = useRef<BlobPart[]>([])

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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {examples.map((example, index) => (
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
                {isPlayingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
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
  )
}

