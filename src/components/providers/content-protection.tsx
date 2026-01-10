"use client"

import { useEffect } from "react"

export function ContentProtection() {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        // Disable keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === "F12") {
                e.preventDefault()
                return
            }

            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === "I") {
                e.preventDefault()
                return
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === "J") {
                e.preventDefault()
                return
            }

            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === "C") {
                e.preventDefault()
                return
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === "u") {
                e.preventDefault()
                return
            }

            // Ctrl+S (Save)
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault()
                return
            }

            // Ctrl+P (Print)
            if (e.ctrlKey && e.key === "p") {
                e.preventDefault()
                return
            }
        }

        document.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <style jsx global>{`
      body {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      /* Allow selection in inputs and textareas so forms still work */
      input, textarea {
        user-select: text;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
      }
    `}</style>
    )
}
