import Sidebar from '@/Components/Sidebar'
import Navbar from '@/Components/Navbar'
import FlashMessage from '@/Components/FlashMessage'

export default function AppShell({ children }) {
    return (
        <div className="dcms-shell">
            <Sidebar />
            <div className="min-h-screen pl-[240px]">
                <Navbar />
                <main className="px-8 py-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
            <FlashMessage />
        </div>
    )
}
