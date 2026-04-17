import { useState, useMemo, useEffect, useCallback } from 'react'
import { Order } from '@/types/order'
import { getOrders } from '@/lib/supabase/orders'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const data = await getOrders()
    setOrders(data ?? [])
    setLoading(false)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchOrders() }, [fetchOrders])

  function handleStatusChange(id: string, status: Order['status'], totalPrice?: number) {
    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === id
          ? { ...o, status, updated_at: new Date().toISOString(), ...(totalPrice !== undefined && { total_price: totalPrice }) }
          : o
      )
    )
  }

  const totalOrders = orders.length
  const pending     = orders.filter((o) => o.status === 'pending').length
  const completed   = orders.filter((o) => o.status === 'completed').length
  const totalFiles  = orders.reduce((acc, o) => acc + o.files.length, 0)

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' && o.total_price != null)
    .reduce((acc, o) => acc + o.total_price!, 0)

  const pendingRevenue = orders
    .filter((o) => o.status === 'ready' && o.total_price != null)
    .reduce((acc, o) => acc + o.total_price!, 0)

  const avgOrderValue = completed > 0 ? totalRevenue / completed : 0

  const byStatus = useMemo(() =>
    (['pending', 'ready', 'completed', 'cancelled'] as Order['status'][]).map((s) => ({
      status: s,
      count: orders.filter((o) => o.status === s).length,
    }))
  , [orders])

  const byBranch = useMemo(() => {
    const map: Record<string, number> = {}
    orders.forEach((o) => { map[o.branch] = (map[o.branch] ?? 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [orders])

  const revenueByBranch = useMemo(() => {
    const map: Record<string, number> = {}
    orders
      .filter((o) => o.status === 'completed' && o.total_price != null)
      .forEach((o) => { map[o.branch] = (map[o.branch] ?? 0) + o.total_price! })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [orders])

  const recentCustomers = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  , [orders])

  return {
    orders,
    loading,
    fetchOrders,
    handleStatusChange,
    totalOrders,
    pending,
    completed,
    totalFiles,
    totalRevenue,
    pendingRevenue,
    avgOrderValue,
    byStatus,
    byBranch,
    revenueByBranch,
    recentCustomers,
  }
}