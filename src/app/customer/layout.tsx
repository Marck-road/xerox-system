import Navbar from "@/components/ui/navbar"

export const metadata = {
  title: {
    default: "Connections Copier Online Ordering",
    template: "%s | Connections Copier",
  },
}

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}