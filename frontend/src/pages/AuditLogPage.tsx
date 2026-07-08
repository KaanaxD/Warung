import { PageLayout } from "@/components/layout/PageLayout"
import { Table } from "@/components/ui/Table"
import { Pagination } from "@/components/ui/Pagination"
import { ErrorState } from "@/components/ui/ErrorState"
import { useLogs } from "@/hooks/useLogs"
import { usePagination } from "@/hooks/usePagination"
import type { AuditLog } from "@/types/product"

export default function AuditLogPage() {
  const pagination = usePagination(10)
  const { logs, meta, loading, error, refetch } = useLogs({
    page: pagination.page,
    limit: pagination.limit,
  })

  return (
    <PageLayout title="Log Aktivitas">
      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <Table
            columns={[
              { key: "admin_name", header: "Admin" },
              { key: "item_id", header: "ID Item" },
              { key: "action", header: "Aksi" },
              {
                key: "updated_at",
                header: "Waktu",
                render: (log: AuditLog) =>
                  new Date(log.updated_at).toLocaleString("id-ID"),
              },
            ]}
            data={logs}
            keyExtractor={(log) => log.id}
            loading={loading}
            emptyMessage="Belum ada log aktivitas"
          />
          <Pagination
            page={pagination.page}
            totalPages={meta?.totalPages ?? 1}
            isFirstPage={pagination.isFirstPage}
            isLastPage={pagination.isLastPage}
            onPrev={pagination.prevPage}
            onNext={pagination.nextPage}
            onGoTo={pagination.goToPage}
          />
        </>
      )}
    </PageLayout>
  )
}
