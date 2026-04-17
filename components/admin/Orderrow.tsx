'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Order } from '@/types/order'
import { updateOrderStatus } from '@/lib/supabase/orders'
import { formatDate } from '@/lib/formatters'
import { FileRow } from './Filerow'
import { StatusBadge } from './Statusbadge'
import { CheckCircle2 } from 'lucide-react'

interface OrderRowProps {
  order: Order
  onStatusChange: (id: string, status: Order['status'], totalPrice?: number) => void
}

export function OrderRow({ order, onStatusChange }: OrderRowProps) {
  const [updating, setUpdating] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [price, setPrice] = useState('')

  async function handleStatusChange(value: string) {
    const newStatus = value as Order['status']
    if (newStatus === 'ready') {
      setShowPriceModal(true)
      return
    }
    setUpdating(true)
    await updateOrderStatus(order.order_id, order.name, order.email, newStatus)
    onStatusChange(order.order_id, newStatus)
    setUpdating(false)
  }

  async function handlePriceConfirm() {
    const numericPrice = Number(price)
    if (!price || isNaN(numericPrice) || numericPrice <= 0) return
    setUpdating(true)
    setShowPriceModal(false)
    await updateOrderStatus(order.order_id, order.name, order.email, 'ready', numericPrice)
    onStatusChange(order.order_id, 'ready', numericPrice)
    setPrice('')
    setUpdating(false)
  }

  function handleModalClose() {
    setShowPriceModal(false)
    setPrice('')
  }

  async function handleMarkComplete() {
    setUpdating(true)
    await updateOrderStatus(order.order_id, order.name, order.email, 'completed')
    onStatusChange(order.order_id, 'completed')
    setUpdating(false)
  }

  const isCompleted  = order.status === 'completed'
  const isCancelled  = order.status === 'cancelled'
  const isTerminal   = isCompleted || isCancelled

  return (
    <>
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div>
              <h3 className="text-base font-extrabold text-zinc-900">Set order price</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter the total price before marking this order as{' '}
                <span className="font-semibold text-blue-600">Ready</span>.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Price (₱) <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">₱</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePriceConfirm()}
                  placeholder="0.00"
                  className="pl-7 border-zinc-200 focus-visible:ring-orange-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm"
                className="border-zinc-200 text-zinc-500 hover:text-zinc-800"
                onClick={handleModalClose}>
                Cancel
              </Button>
              <Button size="sm"
                className="bg-orange-500 hover:bg-orange-400 text-white"
                disabled={!price || isNaN(Number(price)) || Number(price) <= 0}
                onClick={handlePriceConfirm}>
                Confirm & mark ready
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Accordion row ── */}
      <AccordionItem
        value={order.order_id}
        className="border border-zinc-200 rounded-xl mb-3 overflow-hidden shadow-sm"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-50 [&>svg]:text-zinc-400 data-[state=open]:bg-zinc-50">
          <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-left">
            <span className="text-xs font-mono font-bold text-zinc-400 w-20">{String(order.order_id).slice(0, 8)}</span>
            <span className="text-sm font-semibold text-zinc-800 w-36 truncate">{order.name}</span>
            <span className="text-xs text-zinc-400 hidden sm:block w-40 truncate">{order.email}</span>
            <span className="text-xs text-zinc-500 hidden md:block w-24">{order.branch}</span>
            <span className="text-xs text-zinc-400 hidden lg:block w-24">{formatDate(order.pickup_date)}</span>
            <span className="text-xs text-zinc-300 hidden lg:block w-28">{formatDate(order.created_at)}</span>
            <span className="text-xs text-zinc-500 hidden sm:block w-20">
              {order.total_price != null ? `₱${order.total_price}` : '—'}
            </span>
            <span className="ml-auto mr-2"><StatusBadge status={order.status} /></span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="flex flex-col gap-4 pt-3">
            {!isTerminal && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Update status</span>
                {order.status === 'ready' ? (
                  <Button size="sm"
                    className="h-8 gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white"
                    disabled={updating}
                    onClick={handleMarkComplete}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {updating ? 'Saving…' : 'Mark as complete'}
                  </Button>
                ) : (
                  <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
                    <SelectTrigger className="h-8 w-40 text-xs border-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {updating && <span className="text-xs text-zinc-400">Saving…</span>}
              </div>
            )}

            <Separator />

            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Files — {order.files.length} {order.files.length === 1 ? 'file' : 'files'}
              </p>
              {order.files.map((f) => (
                <FileRow key={f.file_id} file={f} orderId={order.order_id} />
              ))}
            </div>

          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  )
}