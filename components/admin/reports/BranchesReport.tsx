import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GitBranch } from 'lucide-react'

interface Props {
  byBranch: [string, number][]
  totalOrders: number
}

export function OrdersByBranch({ byBranch, totalOrders }: Props) {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-orange-500" /> Orders by Branch
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Branch</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Count</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byBranch.map(([branch, count]) => (
              <TableRow key={branch} className="border-zinc-100">
                <TableCell className="text-sm font-semibold text-zinc-700">{branch}</TableCell>
                <TableCell className="text-right font-semibold text-sm text-zinc-700">{count}</TableCell>
                <TableCell className="text-right text-xs text-zinc-400">
                  {totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}