"use client"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { useState } from "react"
import HomePage from "./home"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SpeakEasy</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/practice" className="text-sm font-medium hover:text-primary">
            Practice
          </Link>
          <Link href="/pronunciation" className="text-sm font-medium hover:text-primary">
            Pronunciation
          </Link>
          <Link href="/progress" className="text-sm font-medium hover:text-primary">
            Progress
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SpeakEasy</span>
            </Link>

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="container max-w-7xl mx-auto px-4 py-8 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/practice"
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Practice
            </Link>
            <Link
              href="/pronunciation"
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Pronunciation
            </Link>
            <Link
              href="/progress"
              className="text-lg font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Progress
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2025 SpeakEasy English Learning. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function Home() {
  return <HomePage />
}

