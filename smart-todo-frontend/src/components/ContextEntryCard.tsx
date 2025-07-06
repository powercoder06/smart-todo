interface ContextEntry {
  id: number
  content: string
  source_type: string
  timestamp: string
}

export default function ContextEntryCard({ entry }: { entry: ContextEntry }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg p-4 
        hover:shadow-md transition-shadow
      "
    >
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          [{entry.source_type.toUpperCase()}]
        </span>
        <time className="italic">
          {new Date(entry.timestamp).toLocaleString()}
        </time>
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {entry.content}
      </p>
    </div>
  )
}
