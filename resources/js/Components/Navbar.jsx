import { Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'

export default function Navbar() {
    const { auth } = usePage().props
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            router.post('/logout', {}, {
                onSuccess: () => {
                    router.visit('/')
                },
                onError: () => {
                    setIsLoggingOut(false)
                    alert('Logout failed. Please try again.')
                }
            })
        } catch (error) {
            setIsLoggingOut(false)
            console.error('Logout error:', error)
        }
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

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Dental Clinic Management System</p>
            </div>
            <div className="flex gap-6 items-center">
                {auth?.user ? (
                    <>
                        {/* Notification Icon */}
                        <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full font-bold text-xs text-white flex items-center justify-center">1</span>
                        </button>

                        {/* User Profile */}
                        <Link
                            href={getProfileLink()}
                            className="flex items-center gap-3 group hover:opacity-75 transition-opacity"
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-500">
                                    {auth.user.role === 'admin' ? 'System Admin' : auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-teal-600 transition-colors">
                                {getInitials(auth.user.name)}
                            </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="ml-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Logout"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">Login</Link>
                    </>
                )}
            </div>
        </nav>
    )
}