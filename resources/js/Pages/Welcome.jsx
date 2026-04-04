import { Link } from '@inertiajs/react'

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#061A18]">
            <div className="text-[#E2FAF7]">
                <div className="text-center py-16">
                    <h1 className="text-5xl font-bold text-[#0D9488] mb-4">Welcome to DCMS</h1>
                    <p className="text-2xl text-[#7ABFB9] mb-8">Your Smile, Our Priority</p>
                    <Link
                        href="/login"
                        className="px-8 py-3 bg-[#0D9488] text-white rounded-lg hover:bg-[#14B8A6] transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 py-12 max-w-7xl mx-auto px-6">
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-8 rounded-lg">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-[#0D9488] mb-2">Patient Records</h3>
                        <p className="text-[#7ABFB9]">Manage comprehensive patient information and medical history securely.</p>
                    </div>
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-8 rounded-lg">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-[#0D9488] mb-2">Easy Scheduling</h3>
                        <p className="text-[#7ABFB9]">Book, reschedule, and manage appointments with ease.</p>
                    </div>
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-8 rounded-lg">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-[#0D9488] mb-2">Secure Access</h3>
                        <p className="text-[#7ABFB9]">Role-based access ensures data security and privacy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
