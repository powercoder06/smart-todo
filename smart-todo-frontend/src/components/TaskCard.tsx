import Link from "next/link"
import { CalendarIcon, TagIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import { format } from "date-fns"

interface Task {
  id: number
  title: string
  description: string
  deadline: string
  priority_score: number
  category: { name: string }
}

export default function TaskCard({ task }: { task: Task }) {
  const dueDate = format(new Date(task.deadline), "MMM d, yyyy")
  const priorityPercent = Math.round(task.priority_score * 100)

  return (
    <Link href={`/task/${task.id}`} className="block">
      <div
        className="
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg p-6
          flex flex-col md:flex-row justify-between
          hover:shadow-lg hover:scale-[1.01] transform transition
        "
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {task.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {task.description}
          </p>
          <div className="mt-3 inline-flex items-center space-x-2">
            <TagIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span
              className="
                text-xs font-medium
                bg-blue-100 dark:bg-blue-900
                text-blue-800 dark:text-blue-300
                px-2 py-1 rounded-full
              "
            >
              {task.category.name}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end space-y-2">
          <div className="inline-flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Due {dueDate}</span>
          </div>
          <div className="inline-flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <ArrowUpIcon className="w-4 h-4" />
            <span>Priority {priorityPercent}%</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
