import { Order } from '@/types/order'
import { STATUS_CONFIG } from '@/lib/formatters'

export function StatusBadge({ status }: { status: Order['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}