export const metadata = {
  title: {
    default: "Connections Copier Admin",
    template: "%s | Connections Copier Admin",
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}