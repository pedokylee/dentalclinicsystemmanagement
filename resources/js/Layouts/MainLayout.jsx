import Navbar from '@/Components/Navbar'
import Footer from '@/Components/Footer'
import FlashMessage from '@/Components/FlashMessage'

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#061A18]">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
            <FlashMessage />
        </div>
    )
}