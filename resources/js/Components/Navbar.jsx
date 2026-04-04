import { Link, usePage, router } from '@inertiajs/react'

export default function Navbar() {
    const { auth } = usePage().props

    const handleLogout = () => {
        router.post('/logout')
    }

    const getProfileLink = () => {
        if (!auth?.user) return null
        const role = auth.user.role
        if (role === 'admin') return '/admin/profile'
        if (role === 'dentist') return '/dentist/profile'
        if (role === 'staff') return '/staff/profile'
        if (role === 'patient') return '/patient/profile'
        return '/profile'
    }

    return (
        <nav className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)] px-6 py-4 flex justify-between items-center">
            <span className="font-bold text-[#0D9488] text-lg">DentalClinic</span>
            <div className="flex gap-4 items-center">
                {auth?.user ? (
                    <>
                        <Link 
                            href={getProfileLink()} 
                            className="text-[#7ABFB9] hover:text-[#0D9488] text-sm"
                        >
                            {auth.user.name}
                        </Link>
                        <span className="text-[#4A8C85] text-xs bg-[#0E2C28] px-3 py-1 rounded">
                            {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-[#7ABFB9] hover:text-red-400 text-sm"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/" className="text-[#7ABFB9] hover:text-[#0D9488]">Home</Link>
                        <Link href="/login" className="text-[#7ABFB9] hover:text-[#0D9488]">Login</Link>
                    </>
                )}
            </div>
        </nav>
    )
}