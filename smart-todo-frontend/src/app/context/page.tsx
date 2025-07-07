
import ContextEntryCard from "@/components/ContextEntryCard"
import QuickAddContext from "@/components/QuickAddContext"

export default async function ContextPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/context/`,
    { cache: "no-store" }
  )
  const entries = await res.json()

  return (
    <main className="container mx-auto px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Context Entries</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 mb-8">
        <QuickAddContext />
      </div>
      {entries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No context yet. Add one above!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {entries.map((entry: any) => (
            <ContextEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </main>
  )
}