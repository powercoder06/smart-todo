"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: number
  name: string
}

export default function QuickAdd({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number>(
    categories[0]?.id ?? 0
  )
  const [loading, setLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title) return;

  setLoading(true);
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category_id: categoryId }),
    }
  );

  const data = await resp.json();
  if (!resp.ok) {
    console.error("Failed to create task:", resp.status, data);
    alert(`Error creating task:\n${JSON.stringify(data)}`);
    setLoading(false);
    return;
  }
  setTitle("");
  setDescription("");
  setLoading(false);
  router.refresh();
};


  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-md p-6 
        space-y-4
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            col-span-1 md:col-span-2
            w-full px-4 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-gray-50 dark:bg-gray-700 
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(+e.target.value)}
          className="
            w-full px-4 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-gray-50 dark:bg-gray-700 
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        rows={2}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="
          w-full px-4 py-2 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-gray-50 dark:bg-gray-700 
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
      />

      <button
        type="submit"
        disabled={loading}
        className="
          w-full md:w-auto 
          bg-blue-600 hover:bg-blue-700 
          dark:bg-blue-500 dark:hover:bg-blue-600 
          text-white font-semibold 
          px-6 py-2 rounded-lg 
          transition
          disabled:opacity-50
        "
      >
        {loading ? "Adding…" : "Add Task"}
      </button>
    </form>
  )
}