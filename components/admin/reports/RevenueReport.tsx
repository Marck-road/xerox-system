import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PhilippinePeso } from 'lucide-react'
import { formatPeso } from '@/lib/formatters'

interface Props {
  revenueByBranch: [string, number][]
  totalRevenue: number
  pendingRevenue: number
}

export function RevenueByBranch({ revenueByBranch, totalRevenue, pendingRevenue }: Props) {
  return (
    <Card className="border border-zinc-200 shadow-sm sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
          <PhilippinePeso className="w-4 h-4 text-orange-500" /> Revenue by Branch
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Branch</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Revenue</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueByBranch.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-xs text-zinc-400 py-6">
                  No completed orders yet.
                </TableCell>
              </TableRow>
            ) : revenueByBranch.map(([branch, revenue]) => (
              <TableRow key={branch} className="border-zinc-100">
                <TableCell className="text-sm font-semibold text-zinc-700">{branch}</TableCell>
                <TableCell className="text-right font-semibold text-sm text-zinc-700">{formatPeso(revenue)}</TableCell>
                <TableCell className="text-right text-xs text-zinc-400">
                  {totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pendingRevenue > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Pending revenue (ready orders)</span>
            <span className="text-xs font-semibold text-blue-600">{formatPeso(pendingRevenue)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}