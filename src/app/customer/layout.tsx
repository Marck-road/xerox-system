import Navbar from "@/components/ui/navbar"

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