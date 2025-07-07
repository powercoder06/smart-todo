"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface ContextEntry {
  id: number
  content: string
  source_type: string
  timestamp: string
}
interface Task {
  id: number
  title: string
  description: string
  category: { id: number; name: string }
  priority_score: number
  deadline: string
  status: "pending" | "done"
}
interface Category {
  id: number
  name: string
}

export default function TaskDetail({
  initialTask,
  categories,
  contextEntries,
}: {
  initialTask: Task
  categories: Category[]
  contextEntries: ContextEntry[]
}) {
  const router = useRouter()
  const [task, setTask] = useState<Task>(initialTask)
  const [selectedCtx, setSelectedCtx] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const updateField = (field: keyof Task, value: any) =>
    setTask(prev => ({ ...prev, [field]: value }))

  const toggleCtx = (id: number) =>
    setSelectedCtx((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    )

  const handleSave = async () => {
    setLoading(true)
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${task.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          category_id: task.category.id,
          priority_score: task.priority_score,
          deadline: task.deadline,
          status: task.status,
        }),
      }
    )
    setLoading(false)
    router.push("/")
  }

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return
    setLoading(true)
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${task.id}/`,
      { method: "DELETE" }
    )
    setLoading(false)
    router.push("/")
  }
const handleAi = async () => {
  console.log("→ Ask AI clicked, selectedCtx:", selectedCtx)
  setAiLoading(true)
  setAiError(null)

  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  const url = `${base}/tasks/${task.id}/ai-suggest/`
  console.log("→ Fetching:", url)

  try {
    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          category_id: task.category.id,
          context_entry_ids: selectedCtx,        }),
      })

      console.log("← status", resp.status)
      const body = await resp.json()
      console.log("← JSON", body)

    if (!resp.ok) {
      throw new Error(body.detail || JSON.stringify(body))
    }

    updateField("priority_score", body.priority_score)
      updateField("deadline",       body.deadline)
      updateField("description",    body.enhanced_description)
    if (body.categories?.length) {
      const match = categories.find(c => c.name === body.categories[0])
      if (match) updateField("category", match)
    }

  } catch (err: any) {
    console.error("⚠️ handleAi error:", err)
    setAiError(err.message)
  } finally {
    setAiLoading(false)
  }
}


  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden">
          {/* Form Body */}
          <div className="px-8 py-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Edit Task
            </h1>

            {aiError && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded">
                {aiError}
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={task.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                />
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={task.category.id}
                  onChange={(e) =>
                    updateField(
                      "category",
                      categories.find((c) => c.id === +e.target.value)
                    )
                  }
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Priority & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Priority (0–1)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={task.priority_score}
                  onChange={(e) =>
                    updateField("priority_score", parseFloat(e.target.value) || 0)
                  }
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={new Date(task.deadline).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    updateField("deadline", new Date(e.target.value).toISOString())
                  }
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                />
              </div>
            </div>

            {/* Context Picker */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                Include Context
              </h2>
              <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                {contextEntries.map((ce) => (
                  <label
                    key={ce.id}
                    className="flex items-start space-x-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCtx.includes(ce.id)}
                      onChange={() => toggleCtx(ce.id)}
                      className="
                        mt-1 h-4 w-4 
                        rounded border-gray-300 dark:border-gray-600 
                        text-blue-600 focus:ring-blue-400
                      "
                    />
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">
                        [{ce.source_type.toUpperCase()}]
                      </span>{" "}
                      {ce.content.length > 60
                        ? ce.content.slice(0, 60) + "…"
                        : ce.content}
                    </div>
                  </label>
                ))}
                {contextEntries.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No context entries.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-4 bg-gray-100 dark:bg-gray-700 flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="
                flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600
                text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50
              "
            >
              {loading ? "Saving…" : "Save"}
            </button>

            <button
              onClick={handleAi}
              disabled={aiLoading}
              className="
                flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50
              "
            >
              {aiLoading ? "Thinking…" : "Ask AI"}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="
                flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
                text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50
              "
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
