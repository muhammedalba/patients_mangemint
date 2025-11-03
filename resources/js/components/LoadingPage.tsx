import React from "react"

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-100 to-indigo-200">
      <div className="flex space-x-4">
        <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}
