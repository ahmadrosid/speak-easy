"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateConversation, generateSpeech } from "@/app/actions"
import { Loader2, Volume2 } from "lucide-react"

const topics = [
  { id: "daily", name: "Daily Conversations" },
  { id: "travel", name: "Travel & Tourism" },
  { id: "business", name: "Business English" },
  { id: "academic", name: "Academic Discussions" },
  { id: "social", name: "Social Situations" },
]

const levels = [
  { id: "beginner", name: "Beginner (A1-A2)" },
  { id: "intermediate", name: "Intermediate (B1-B2)" },
  { id: "advanced", name: "Advanced (C1-C2)" },
]

export default function PracticePage() {
  const [selectedTopic, setSelectedTopic] = useState("daily")
  const [selectedLevel, setSelectedLevel] = useState("intermediate")
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateConversation = async () => {
    setLoading(true)
    try {
      const result = await generateConversation(selectedTopic, selectedLevel)
      setConversation(result)
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error("Error generating conversation:", error)
      setError(error.message || "Failed to generate conversation. Please try again.")
      setConversation(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Practice Conversations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Select a Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to generate a new conversation based on your selected topic and difficulty level.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateConversation} className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Conversation"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {conversation && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{conversation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="conversation">
              <TabsList className="mb-4">
                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                <TabsTrigger value="vocabulary">Vocabulary & Phrases</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>

              <TabsContent value="conversation">
                <div className="space-y-4">
                  {conversation.dialogue.map((exchange: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={`font-medium ${exchange.speaker === "Person A" ? "text-blue-600" : "text-green-600"}`}
                        >
                          {exchange.speaker}:
                        </div>
                        <div className="flex-1">{exchange.text}</div>
                        <AudioButton text={exchange.text} />
                      </div>
                      {exchange.pronunciation && (
                        <div className="pl-6 text-sm text-muted-foreground">
                          Pronunciation: <span className="font-mono">{exchange.pronunciation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="vocabulary">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Vocabulary & Phrases</h3>
                  <ul className="space-y-2">
                    {conversation.vocabulary.map((item: any, index: number) => (
                      <li key={index} className="border-b pb-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.phrase}</div>
                          <AudioButton text={item.phrase} />
                        </div>
                        <div className="text-sm text-muted-foreground">{item.meaning}</div>
                        {item.pronunciation && <div className="text-sm font-mono">{item.pronunciation}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="practice">
                <PronunciationPractice phrases={conversation.vocabulary.map((v: any) => v.phrase)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// New component for playing audio examples
function AudioButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [audioData, setAudioData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePlayAudio = async () => {
    // If we already have the audio data, play it
    if (audioData) {
      const audio = new Audio(`data:audio/mpeg;base64,${audioData}`)
      audio.play()
      return
    }

    // Otherwise, fetch the audio data
    setIsLoading(true)
    setError(null)

    try {
      const result = await generateSpeech(text)
      setAudioData(result.audio)

      // Play the audio
      const audio = new Audio(`data:${result.contentType};base64,${result.audio}`)
      audio.play()
    } catch (err) {
      console.error("Error playing audio:", err)
      setError("Failed to play audio. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlayAudio}
      disabled={isLoading}
      title={error || "Listen to pronunciation"}
      className="flex-shrink-0"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  )
}

function PronunciationPractice({ phrases }: { phrases: string[] }) {
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [selectedPhrase, setSelectedPhrase] = useState(phrases[0] || "")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)

        // Simulate AI feedback (in a real app, you would send this to your API)
        setTimeout(() => {
          setFeedback("Your pronunciation is good! Pay attention to the stress on the second syllable.")
        }, 1500)
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

  const playExampleAudio = async () => {
    setIsLoadingAudio(true)
    try {
      const result = await generateSpeech(selectedPhrase)
      const audio = new Audio(`data:audio/mpeg;base64,${result.audio}`)
      audio.play()
    } catch (err) {
      console.error("Error playing example audio:", err)
    } finally {
      setIsLoadingAudio(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Practice Pronunciation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a phrase, listen to the example, then record yourself saying it to get feedback.
        </p>
      </div>

      <div className="space-y-4">
        <Select value={selectedPhrase} onValueChange={setSelectedPhrase}>
          <SelectTrigger>
            <SelectValue placeholder="Select a phrase to practice" />
          </SelectTrigger>
          <SelectContent>
            {phrases.map((phrase, index) => (
              <SelectItem key={index} value={phrase}>
                {phrase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col space-y-2">
          <div className="font-medium">{selectedPhrase}</div>
          <Button variant="outline" className="w-full sm:w-auto" onClick={playExampleAudio} disabled={isLoadingAudio}>
            {isLoadingAudio ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Audio...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Listen to Example
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            {recording ? (
              <Button variant="destructive" onClick={stopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startRecording}>Start Recording</Button>
            )}

            {audioURL && (
              <Button
                variant="outline"
                onClick={() => {
                  const audio = new Audio(audioURL)
                  audio.play()
                }}
              >
                Play Recording
              </Button>
            )}
          </div>

          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

