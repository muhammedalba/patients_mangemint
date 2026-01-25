
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Info } from "lucide-react";

interface DynamicTableProps {
  data: any[];
  columns?: ColumnDef<any>[];
}

export function DynamicTable({ data, columns }: DynamicTableProps) {
  // إنشاء الأعمدة تلقائيًا إذا لم يتم تمريرها
  const generatedColumns: ColumnDef<any>[] = columns ?? [
    ...Object.keys(data[0] || {}).map((key) => ({
      id: key,
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: ({ row }: { row: any }) => (
        <span className="truncate block">{row.getValue(key)}</span>
      ),
    })),
    {
      id: "actions",
      header: "Action",
      cell: ({ row }: { row: any }) => (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => console.log("Details for", row.original)}
        >
          <Info size={16} />
          Details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: generatedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-gray-50">
        <FileText size={48} className="text-gray-300 mb-4" />
        <h3 className="text-gray-600 text-lg font-medium">
          لا توجد بيانات لعرضها
        </h3>
        <p className="text-gray-400 mt-1 text-sm">
          قم بإضافة بيانات لتظهر هنا.
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-right px-4 py-2 text-gray-700 uppercase text-xs tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="bg-white">
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="text-right px-4 py-2 text-gray-600 truncate max-w-xs"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
