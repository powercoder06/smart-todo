"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuickAddContext() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [source, setSource] = useState("note")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const resp = await fetch( `${process.env.NEXT_PUBLIC_API_BASE_URL}/context/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, source_type: source }),
    })
    if (resp.ok) {
      setContent("")
      setLoading(false)
      router.refresh()
    } else {
      console.error(await resp.json())
      setLoading(false)
    }
  }
 return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-md p-6 mb-8
        space-y-4
      "
    >
      <textarea
        rows={3}
        className="
          w-full px-4 py-3 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-gray-50 dark:bg-gray-700 
          text-gray-900 dark:text-gray-100 
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
        placeholder="Enter note, email snippet, etc."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <select
          className="
            flex-1 px-4 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-gray-50 dark:bg-gray-700 
            text-gray-900 dark:text-gray-100 
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="note">Note</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full sm:w-auto 
            bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 
            text-white font-semibold 
            px-6 py-2 rounded-lg 
            transition disabled:opacity-50
          "
        >
          {loading ? "Saving…" : "Add Context"}
        </button>
      </div>
    </form>
  )
}