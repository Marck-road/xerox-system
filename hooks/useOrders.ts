import { getOrders } from '@/lib/supabase/orders'
import { Order } from '@/types/order'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
  const newOrders     = orders.filter((o) => o.status === 'new').length
  const pending     = orders.filter((o) => o.status === 'pending' || o.status === 'printing' || o.status === 'ready').length
  const completed   = orders.filter((o) => o.status === 'completed').length
  const totalFiles  = orders.reduce((acc, o) => acc + o.files.length, 0)

  const [ordersDateFilter, setOrdersDateFilter] = useState<'all' | 'month'>('all');
  const [revenueDateFilter, setRevenueDateFilter] = useState<'all' | 'month'>('all');

  const totalRevenue = orders
    .filter((o) => o.status === 'completed' && o.total_price != null)
    .reduce((acc, o) => acc + o.total_price!, 0)

  const monthlyRevenue = orders
    .filter((o) =>
      o.status === 'completed' &&
      o.total_price != null &&
      new Date(o.created_at) >= startOfMonth
    )
    .reduce((acc, o) => acc + o.total_price!, 0);

  const pendingRevenue = orders
    .filter((o) => o.status === 'ready' || o.status === 'pending' || o.status === 'printing' && o.total_price != null)
    .reduce((acc, o) => acc + o.total_price!, 0)

  const avgOrderValue = completed > 0 ? totalRevenue / completed : 0

  const byStatus = useMemo(() =>
    (['new', 'pending', 'ready', 'completed', 'cancelled', 'printing'] as Order['status'][]).map((s) => ({
      status: s,
      count: orders.filter((o) => o.status === s).length,
    }))
  , [orders])

  const byBranch = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const filtered = orders.filter(o => {
      if (ordersDateFilter === 'all') return true;
      return new Date(o.created_at) >= startOfMonth;
    });

    const map: Record<string, number> = {};

    filtered.forEach((o) => {
      map[o.branch] = (map[o.branch] ?? 0) + 1;
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders, ordersDateFilter]);

  const revenueByBranch = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const map: Record<string, number> = {};

    orders
      .filter((o) => {
        if (o.status !== 'completed' || o.total_price == null) return false;

        if (revenueDateFilter === 'all') return true;

        return new Date(o.created_at) >= startOfMonth;
      })
      .forEach((o) => {
        map[o.branch] = (map[o.branch] ?? 0) + o.total_price!;
      });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders, revenueDateFilter]);

  const recentCustomers = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  , [orders])

  const totalOrdersByBranch = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter(o => {
      if (ordersDateFilter === 'all') return true;
      return new Date(o.created_at) >= startOfMonth;
    }).length;
  }, [orders, ordersDateFilter]);

  const totalRevenueFiltered = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders
      .filter(o => {
        if (o.status !== 'completed' || o.total_price == null) return false;
        if (revenueDateFilter === 'all') return true;
        return new Date(o.created_at) >= startOfMonth;
      })
      .reduce((acc, o) => acc + o.total_price!, 0);
  }, [orders, revenueDateFilter]);

  return {
    orders,
    loading,
    fetchOrders,
    handleStatusChange,
    totalOrders,
    newOrders,
    pending,
    completed,
    totalFiles,
    totalRevenue,
    monthlyRevenue,
    pendingRevenue,
    avgOrderValue,
    byStatus,
    byBranch,
    revenueByBranch,
    recentCustomers,
    ordersDateFilter, setOrdersDateFilter,
    revenueDateFilter, setRevenueDateFilter,
    totalOrdersByBranch, totalRevenueFiltered
  }
}