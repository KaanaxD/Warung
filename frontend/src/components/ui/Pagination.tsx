import { Button } from "./Button"

interface PaginationProps {
  page: number
  totalPages: number
  isFirstPage: boolean
  isLastPage: boolean
  onPrev: () => void
  onNext: () => void
  onGoTo: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  isFirstPage,
  isLastPage,
  onPrev,
  onNext,
  onGoTo,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button variant="outline" size="sm" disabled={isFirstPage} onClick={onPrev}>
        Prev
      </Button>
      {pages[0] > 1 && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onGoTo(1)}>1</Button>
          {pages[0] > 2 && <span className="text-neutral-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "primary" : "ghost"}
          size="sm"
          onClick={() => onGoTo(p)}
        >
          {p}
        </Button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-neutral-400">...</span>}
          <Button variant="ghost" size="sm" onClick={() => onGoTo(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}
      <Button variant="outline" size="sm" disabled={isLastPage} onClick={onNext}>
        Next
      </Button>
    </div>
  )
}
