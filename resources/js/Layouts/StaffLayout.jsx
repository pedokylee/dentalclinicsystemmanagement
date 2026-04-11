import Sidebar from '@/Components/Sidebar'
import Navbar from '@/Components/Navbar'
import FlashMessage from '@/Components/FlashMessage'

export default function StaffLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto bg-white">
                    <div className="w-full p-8">
                        {children}
                    </div>
                </main>
            </div>
            <FlashMessage />
        </div>
    )
}
