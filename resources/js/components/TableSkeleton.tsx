import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export default function TableSkeleton({ columnCount, rowCount = 5 }: TableSkeletonProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: columnCount }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24 bg-indigo-100/50" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <div className="flex items-center gap-2">
                     {/* Randomly add circle skeleton to mimic avatars or icons for the first column */}
                    {colIndex === 0 && (
                        <Skeleton className="h-8 w-8 rounded-full bg-slate-100" />
                    )}
                    <Skeleton 
                        className={`h-4 bg-slate-100 ${colIndex === 0 ? 'w-32' : 'w-full'}`} 
                    />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
