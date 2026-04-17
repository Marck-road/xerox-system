import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'
import { Order } from '@/types/order'
import { StatusBadge } from '../Statusbadge'

interface Props {
  recentCustomers: Order[]
}

export function RecentCustomers({ recentCustomers }: Props) {
  return (
    <Card className="border border-zinc-200 shadow-sm sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-500" /> Recent Customers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Name</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">Branch</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Files</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCustomers.map((o) => (
              <TableRow key={o.order_id} className="border-zinc-100">
                <TableCell className="text-sm font-semibold text-zinc-700">{o.name}</TableCell>
                <TableCell className="text-xs text-zinc-400">{o.email}</TableCell>
                <TableCell className="text-xs text-zinc-500">{o.branch}</TableCell>
                <TableCell className="text-right text-xs text-zinc-500">{o.files.length}</TableCell>
                <TableCell className="text-right"><StatusBadge status={o.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}