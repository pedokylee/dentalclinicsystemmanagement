import Sidebar from '@/Components/Sidebar'
import Navbar from '@/Components/Navbar'
import FlashMessage from '@/Components/FlashMessage'
import { usePage } from '@inertiajs/react'

export default function AdminLayout({ children }) {
    const { auth } = usePage().props

    return (
        <div className="min-h-screen flex bg-[#061A18]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
            <FlashMessage />
        </div>
    )
}