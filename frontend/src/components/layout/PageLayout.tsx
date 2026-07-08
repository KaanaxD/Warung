import { type ReactNode } from "react"

interface PageLayoutProps {
  title: string
  action?: ReactNode
  children: ReactNode
}

export function PageLayout({ title, action, children }: PageLayoutProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  )
}
