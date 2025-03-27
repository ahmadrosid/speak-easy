"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Add this helper function at the top of the file (before any other functions)
function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "")

  // Trim any whitespace
  cleaned = cleaned.trim()

  // If the response starts with a newline or other non-JSON character, trim it
  if (cleaned.startsWith("\n")) {
    cleaned = cleaned.substring(1)
  }

  return cleaned
}

export async function generateConversation(topic: string, level: string) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an English language teaching assistant. Create a realistic conversation scenario for English learners.
      The conversation should be appropriate for ${level} level students and focus on the topic of "${topic}".
      Include phonetic pronunciation guides for key phrases.
      Format your response as a JSON object with the following structure:
      {
        "title": "Conversation title",
        "dialogue": [
          {"speaker": "Person A", "text": "Hello, how are you?", "pronunciation": "/həˈloʊ, haʊ ɑr juː/"},
          {"speaker": "Person B", "text": "I'm fine, thanks.", "pronunciation": "/aɪm faɪn, θæŋks/"}
        ],
        "vocabulary": [
          {"phrase": "How are you", "meaning": "A greeting to ask about someone's wellbeing", "pronunciation": "/haʊ ɑr juː/"},
          {"phrase": "I'm fine", "meaning": "A response indicating you are well", "pronunciation": "/aɪm faɪn/"}
        ]
      }`,
      prompt: `Create a conversation about ${topic} for ${level} level English learners.`,
    })

    // Parse the JSON response
    try {
      const cleanedText = cleanJsonResponse(text)
      return JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", text)
      throw new Error(`Failed to parse conversation data: ${parseError.message}`)
    }
  } catch (error) {
    console.error("Error generating conversation:", error)
    throw new Error(`Failed to generate conversation: ${error.message}`)
  }
}

export async function analyzePronunciation(audioBlob: Blob, text: string) {
  // In a real application, you would upload the audio to your server
  // and use a speech-to-text API to analyze the pronunciation

  // This is a placeholder for the actual implementation
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please check your environment variables.")
    }

    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an English pronunciation analysis tool. 
      Analyze the pronunciation of the text "${text}" and provide feedback.
      Format your response as a JSON object with the following structure:
      {
        "score": 85,
        "feedback": "Your pronunciation was good, but you need to work on...",
        "areas_to_improve": ["specific sound 1", "specific sound 2"]
      }`,
      prompt: `Analyze the pronunciation of "${text}".`,
    })

    // Parse the JSON response
    try {
      const cleanedText = cleanJsonResponse(analysisResult)
      return JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", analysisResult)
      throw new Error(`Failed to parse pronunciation analysis: ${parseError.message}`)
    }
  } catch (error) {
    console.error("Error analyzing pronunciation:", error)
    throw new Error(`Failed to analyze pronunciation: ${error.message}`)
  }
}

// New function to generate speech from text using OpenAI TTS API
export async function generateSpeech(text: string, voice = "alloy") {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please check your environment variables.")
    }

    // Make a direct fetch request to OpenAI's TTS API
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
    }

    // Get the audio data as an ArrayBuffer
    const audioData = await response.arrayBuffer()

    // Convert to base64 for easy transfer to client
    const base64Audio = Buffer.from(audioData).toString("base64")

    return {
      audio: base64Audio,
      contentType: "audio/mpeg",
    }
  } catch (error) {
    console.error("Error generating speech:", error)
    throw new Error(`Failed to generate speech: ${error.message}`)
  }
}

// Add this new function to the existing actions.ts file

export async function generatePronunciationExercise(sound: string, level: string) {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an English pronunciation teaching assistant. Create a pronunciation exercise focused on a specific sound or phonetic feature.
      The exercise should be appropriate for ${level} level students and focus on the "${sound}" sound or feature.
      Format your response as a JSON object with the following structure:
      {
        "id": "unique-id-for-the-sound",
        "title": "Exercise title",
        "description": "Brief description of the sound and how to pronounce it",
        "examples": [
          {"text": "Example word", "phonetic": "/phonetic-transcription/"},
          {"text": "Another word", "phonetic": "/phonetic-transcription/"}
        ]
      }`,
      prompt: `Create a pronunciation exercise for the "${sound}" sound for ${level} level English learners.`,
    })

    // Parse the JSON response
    try {
      const cleanedText = cleanJsonResponse(text)
      return JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", text)
      throw new Error(`Failed to parse pronunciation exercise data: ${parseError.message}`)
    }
  } catch (error) {
    console.error("Error generating pronunciation exercise:", error)
    throw new Error(`Failed to generate pronunciation exercise: ${error.message}`)
  }
}

