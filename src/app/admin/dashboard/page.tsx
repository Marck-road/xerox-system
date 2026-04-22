'use client'

import { useMemo, useState } from 'react'
import { Accordion } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ClipboardList, RefreshCw, Search,
  TrendingUp, Clock, CheckCircle2, FileText, PhilippinePeso,
} from 'lucide-react'

import { useOrders } from '@/hooks/useOrders'
import { StatCard } from '@/components/admin/StatCard'
import { OrderRow } from '@/components/admin/Orderrow'
import { OrdersByStatus } from '@/components/admin/reports/StatusReport'
import { OrdersByBranch } from '@/components/admin/reports/BranchesReport'
import { RevenueByBranch } from '@/components/admin/reports/RevenueReport'
import { RecentCustomers } from '@/components/admin/reports/CustomersReport'
import { formatPeso } from '@/lib/formatters'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const {
    orders, loading, fetchOrders, handleStatusChange,
    totalOrders, pending, completed, totalFiles,
    totalRevenue, pendingRevenue, avgOrderValue,
    byStatus, byBranch, revenueByBranch, recentCustomers,
  } = useOrders()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')

  const filtered = useMemo(() => orders.filter((o) => {
    const matchSearch = search === '' ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.order_id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchBranch = branchFilter === 'all' || o.branch === branchFilter
    return matchSearch && matchStatus && matchBranch
  }), [orders, search, statusFilter, branchFilter])

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-zinc-900 leading-none">Print Orders</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline" size="sm"
          className="h-8 gap-1.5 text-xs border-zinc-200 text-zinc-500"
          onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading…' : 'Refresh'}
        </Button>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-orange-400 text-xs font-medium">Active</span>
        </div>
        <Button variant="outline" size="sm"
          className="h-8 gap-1.5 text-xs border-zinc-200 text-zinc-500"
          onClick={async () => {
            const supabase = await createClient()
            await supabase.auth.signOut()
            window.location.href = '/admin/login'
          }}>
          Logout
        </Button>
        </div>
      </header>

      <main className="max-w-296 mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard label="Total Orders" value={loading ? '…' : totalOrders} icon={TrendingUp} accent="bg-orange-100 text-orange-500" />
          <StatCard label="Pending" value={loading ? '…' : pending} icon={Clock} accent="bg-amber-100 text-amber-500" />
          <StatCard label="Completed" value={loading ? '…' : completed} icon={CheckCircle2} accent="bg-green-100 text-green-600" />
          <StatCard label="Total Files" value={loading ? '…' : totalFiles} icon={FileText} accent="bg-blue-100 text-blue-500" />
          <StatCard label="Total Revenue" value={loading ? '…' : formatPeso(totalRevenue)} icon={PhilippinePeso} accent="bg-emerald-100 text-emerald-600" />
          <StatCard label="Avg Order Value" value={loading ? '…' : formatPeso(avgOrderValue)} icon={TrendingUp} accent="bg-violet-100 text-violet-600" />
        </div>

        {/* ── Orders table ── */}
        <Card className="border border-zinc-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base font-extrabold text-zinc-900">All Orders</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, ID…"
                    className="pl-8 h-8 text-xs w-52 border-zinc-200 focus-visible:ring-orange-400"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-32 text-xs border-zinc-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ready">Ready for Pickup</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="h-8 w-36 text-xs border-zinc-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All branches</SelectItem>
                    <SelectItem value="Western">Western</SelectItem>
                    <SelectItem value="EVSU Outside">EVSU Outside</SelectItem>
                    <SelectItem value="EVSU Inside">EVSU Inside</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-x-4 px-4 pb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="w-20">Order ID</span>
              <span className="w-36">Name</span>
              <span className="hidden sm:block w-40">Email</span>
              <span className="hidden md:block w-25">Branch</span>
              <span className="hidden lg:block w-24">Pick-up</span>
              <span className="hidden lg:block w-28">Submitted</span>
              <span className="hidden lg:block w-28">Total Price</span>
              <span className="ml-auto mr-8">Status</span>
            </div>
            <Separator className="mb-3" />

            {loading ? (
              <div className="py-16 text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading orders…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 text-sm">No orders match your filters.</div>
            ) : (
              <Accordion type="multiple">
                {filtered.map((order) => (
                  <OrderRow key={order.order_id} order={order} onStatusChange={handleStatusChange} />
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* ── Reports ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OrdersByStatus byStatus={byStatus} totalOrders={totalOrders} />
          <OrdersByBranch byBranch={byBranch} totalOrders={totalOrders} />
          <RevenueByBranch
            revenueByBranch={revenueByBranch}
            totalRevenue={totalRevenue}
            pendingRevenue={pendingRevenue}
          />
          <RecentCustomers recentCustomers={recentCustomers} />
        </div>

      </main>
    </div>
  )
}