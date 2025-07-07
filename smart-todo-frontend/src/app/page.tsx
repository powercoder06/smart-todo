import TaskCard from "@/components/TaskCard"
import QuickAdd from "@/components/QuickAdd"

export default async function DashboardPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL

  const [tasksRes, catsRes] = await Promise.all([
    fetch(`${base}/tasks/`, { cache: "no-store" }),
    fetch(`${base}/categories/`, { cache: "no-store" }),
  ])
  const tasks = await tasksRes.json()
  const categories = await catsRes.json()


  return (
    <main className="container mx-auto px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your Tasks</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6 mb-8">
        <QuickAdd categories={categories} />
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 mt-8">No tasks yet. Add one above!</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {tasks.map((t: any) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </main>
  )
}