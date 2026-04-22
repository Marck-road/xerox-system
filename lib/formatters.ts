import { Clock, CheckCircle2, XCircle, PackageCheck } from 'lucide-react'
import { FileOrder, Order } from '@/types/order'

export const STATUS_CONFIG: Record<Order['status'], {
  label: string
  icon: React.ElementType
  classes: string
}> = {
  pending: { label: 'Pending', icon: Clock, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  ready: { label: 'Ready', icon: PackageCheck, classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', icon: CheckCircle2, classes: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', icon: XCircle, classes: 'bg-red-50 text-red-600 border-red-200' },
}

export const SERVICE_LABEL: Record<FileOrder['service'], string> = {
  'print-only': 'Print Only',
  'print-softbound': 'Print + Softbound',
  'print-laminate': 'Print + Laminate',
}

export const SIZE_LABEL: Record<FileOrder['paper_size'], string> = {
  short: 'Short',
  A4: 'A4',
  long: 'Long',
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export function formatPeso(value: number) {
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}