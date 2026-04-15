import { Link } from '@inertiajs/react'
import PrimaryButton from '@/Components/PrimaryButton'

export default function Welcome() {
    return (
        <div className="min-h-screen bg-brand-bg-dark">
            <div className="text-brand-text-light">
                <div className="text-center py-16">
                    <h1 className="text-5xl font-bold text-brand-primary mb-4">Welcome to DCMS</h1>
                    <p className="text-2xl text-brand-text-muted mb-8">Your Smile, Our Priority</p>
                    <Link
                        href="/login"
                        className="inline-block"
                    >
                        <PrimaryButton size="lg">
                            Get Started
                        </PrimaryButton>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 py-12 max-w-7xl mx-auto px-6">
                    <div className="bg-brand-bg-dark border border-brand-border-light p-8 rounded-xl">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-brand-primary mb-2">Patient Records</h3>
                        <p className="text-brand-text-muted">Manage comprehensive patient information and medical history securely.</p>
                    </div>
                    <div className="bg-brand-bg-dark border border-brand-border-light p-8 rounded-xl">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-brand-primary mb-2">Easy Scheduling</h3>
                        <p className="text-brand-text-muted">Book, reschedule, and manage appointments with ease.</p>
                    </div>
                    <div className="bg-brand-bg-dark border border-brand-border-light p-8 rounded-xl">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-brand-primary mb-2">Secure Access</h3>
                        <p className="text-brand-text-muted">Role-based access ensures data security and privacy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
