import Sidebar from '@/Components/Sidebar'
import Navbar from '@/Components/Navbar'
import FlashMessage from '@/Components/FlashMessage'
import { usePage } from '@inertiajs/react'

export default function AdminLayout({ children }) {
    const { auth } = usePage().props

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="pl-64 flex flex-col transition-all duration-300">
                <Navbar />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <FlashMessage />
        </div>
    )
}