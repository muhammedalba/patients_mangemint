"use client"

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DynamicTableProps {
  data: any[],
  columns?: ColumnDef<any>[]
}

export function DynamicTable({ data, columns }: DynamicTableProps) {
  const generatedColumns: ColumnDef<any>[] = columns ?? [
  ...Object.keys(data[0]).map(key => ({
    id: key,
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }) => <div>{row.getValue(key)}</div>,
  })),
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button
        variant="outline"
        onClick={() => console.log("Details for", row.original)}
      >
        Details
      </Button>
    ),
  },
]

const table = useReactTable({
  data,
  columns: generatedColumns,
  getCoreRowModel: getCoreRowModel(),
})


  if (!data || data.length === 0) return <p>No data available</p>

  return (
    <div className="rounded-lg border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
