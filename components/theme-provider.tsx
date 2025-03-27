"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI only after
  // hydration to prevent hydration mismatch errors
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure consistent rendering between server and client
  // by only rendering the children after the component is mounted
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : null}
    </NextThemesProvider>
  )
}
