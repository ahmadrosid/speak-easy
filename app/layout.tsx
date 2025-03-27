import type React from "react"
import type { Metadata } from "next"
import RootLayoutClient from "./root-layout-client"

export const metadata: Metadata = {
  title: "English Learning App",
  description: "Learn English with AI-powered conversations and pronunciation analysis",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}

