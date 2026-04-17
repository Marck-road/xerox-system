import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  accent: string
}

export function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
          <p className="text-2xl font-extrabold text-zinc-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}