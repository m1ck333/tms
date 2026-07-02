import { useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Inbox,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'
import { IconButton } from './button'
import { Select } from './select'
import { Spinner } from './spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

// Re-export so apps can type their columns without depending on @tanstack directly.
export type { ColumnDef } from '@tanstack/react-table'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  emptyText?: string
  onRowClick?: (row: TData) => void
  pageSize?: number
  pageSizeOptions?: number[]
}

function SortIcon({ dir }: { dir: false | 'asc' | 'desc' }) {
  if (dir === 'asc') return <ChevronUp className="size-3.5" />
  if (dir === 'desc') return <ChevronDown className="size-3.5" />
  return <ChevronsUpDown className="size-3.5 opacity-50" />
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyText,
  onRowClick,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData, TValue>) {
  const strings = useUiStrings()
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount() || 1
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * currentPageSize + 1
  const to = Math.min((pageIndex + 1) * currentPageSize, total)

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow
                key={group.id}
                className="bg-muted/50 hover:bg-muted/50"
              >
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const content = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                  return (
                    <TableHead key={header.id}>
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-foreground inline-flex cursor-pointer items-center gap-1 select-none"
                        >
                          {content}
                          <SortIcon dir={header.column.getIsSorted()} />
                        </button>
                      ) : (
                        content
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <Spinner size="sm" /> {strings.loading}
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Inbox className="size-6" />
                    <span className="text-sm">
                      {emptyText ?? strings.noResults}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {strings.showing(from, to, total)}
        </span>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-sm sm:block">
              {strings.rowsPerPage}
            </span>
            <Select
              className="w-[80px]"
              value={String(currentPageSize)}
              onChange={(value) => table.setPageSize(Number(value))}
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
            />
          </div>

          <span className="text-muted-foreground hidden text-sm tabular-nums sm:block">
            {strings.pageInfo(pageIndex + 1, pageCount)}
          </span>

          <div className="flex items-center gap-1">
            <IconButton
              className="hidden sm:flex"
              icon={<ChevronsLeft />}
              variant="outline"
              size="sm"
              aria-label={strings.firstPage}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            />
            <IconButton
              icon={<ChevronLeft />}
              variant="outline"
              size="sm"
              aria-label={strings.previousPage}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            />
            <IconButton
              icon={<ChevronRight />}
              variant="outline"
              size="sm"
              aria-label={strings.nextPage}
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            />
            <IconButton
              className="hidden sm:flex"
              icon={<ChevronsRight />}
              variant="outline"
              size="sm"
              aria-label={strings.lastPage}
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(pageCount - 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
