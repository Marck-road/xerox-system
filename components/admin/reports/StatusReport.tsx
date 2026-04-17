import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp } from 'lucide-react'
import { Order } from '@/types/order'
import { StatusBadge } from '../Statusbadge'


interface Props {
  byStatus: { status: Order['status']; count: number }[]
  totalOrders: number
}

export function OrdersByStatus({ byStatus, totalOrders }: Props) {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" /> Orders by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Count</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byStatus.map(({ status, count }) => (
              <TableRow key={status} className="border-zinc-100">
                <TableCell><StatusBadge status={status} /></TableCell>
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