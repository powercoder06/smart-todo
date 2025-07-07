import TaskDetail from "@/components/TaskDetail"

export default async function TaskPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>
}) {
  const { id } = await params
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!
  const [taskRes, catsRes, ctxRes] = await Promise.all([
    fetch(`${base}/tasks/${id}/`,      { cache: "no-store" }),
    fetch(`${base}/categories/`,      { cache: "no-store" }),
    fetch(`${base}/context/`,         { cache: "no-store" }),
  ])

  const [task, categories, contextEntries] = await Promise.all([
    taskRes.json(),
    catsRes.json(),
    ctxRes.json(),
  ])

  return (
    <TaskDetail
      initialTask={task}
      categories={categories}
      contextEntries={contextEntries}
    />
  )
}
