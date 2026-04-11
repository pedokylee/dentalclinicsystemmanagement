import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

const IconDashboard = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
)

const IconUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 0m0 0A4 4 0 008.646 8.646 4 4 0 0012 4.354m0 0A4 4 0 1015.354 8.646 4 4 0 0012 4.354zm3 5.646a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const IconClipboard = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const IconHistory = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const IconArchive = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
)

const IconSettings = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
)

const IconUser = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const IconCalendar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const IconCheckmark = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const IconBell = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
)

const IconStethoscope = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.07 4.93L17.65 3.5c-.39-.39-1.02-.39-1.41 0l-1.06 1.06.71.71 1.06-1.07.71.71-1.06 1.06.71.71 1.06-1.06.71.71-1.06 1.06.71.71 1.06-1.07.71.71-1.06 1.06c-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.39.39-1.02 0-1.41z"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>
    </svg>
)

export default function Sidebar() {
    const { auth } = usePage().props
    const currentUrl = usePage().url
    const [isOpen, setIsOpen] = useState(true)

    if (!auth?.user) return null

    const role = auth.user.role

    const navItems = {
        admin: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: <IconDashboard /> },
            { label: 'User Management', href: '/admin/users', icon: <IconUsers /> },
            { label: 'Reports', href: '/admin/reports', icon: <IconClipboard /> },
            { label: 'Audit Log', href: '/admin/audit-log', icon: <IconHistory /> },
            { label: 'Backup & Restore', href: '/admin/backup', icon: <IconArchive /> },
            { label: 'System Config', href: '/admin/config', icon: <IconSettings /> },
        ],
        dentist: [
            { label: 'Dashboard', href: '/dentist/dashboard', icon: <IconDashboard /> },
            { label: 'My Patients', href: '/dentist/patients', icon: <IconUsers /> },
            { label: 'Treatment Record', href: '/dentist/treatment/create', icon: <IconClipboard /> },
            { label: 'My Appointments', href: '/dentist/appointments', icon: <IconCalendar /> },
        ],
        staff: [
            { label: 'Dashboard', href: '/staff/dashboard', icon: <IconDashboard /> },
            { label: 'Register Patient', href: '/staff/patients/create', icon: <IconUser /> },
            { label: 'Book Appointment', href: '/staff/appointments/create', icon: <IconCalendar /> },
            { label: 'Appointments', href: '/staff/appointments', icon: <IconCalendar /> },
            { label: 'Check-in', href: '/staff/checkin', icon: <IconCheckmark /> },
        ],
        patient: [
            { label: 'Dashboard', href: '/patient/dashboard', icon: <IconDashboard /> },
            { label: 'My Profile', href: '/patient/profile', icon: <IconUser /> },
            { label: 'My Appointments', href: '/patient/appointments', icon: <IconCalendar /> },
            { label: 'Treatment History', href: '/patient/history', icon: <IconClipboard /> },
            { label: 'Notifications', href: '/patient/notifications', icon: <IconBell /> },
        ],
    }

    const items = navItems[role] || []
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-[#1B5652] text-white flex flex-col p-4 gap-6 transition-all duration-300 shadow-lg overflow-y-auto fixed top-0 left-0 h-screen z-40`}>
            {/* Logo and Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center text-[#1B5652] font-bold">
                        <IconStethoscope />
                    </div>
                    {isOpen && <span className="font-bold text-lg text-white">DCMS</span>}
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-300 hover:text-white transition-colors"
                    title={isOpen ? 'Collapse' : 'Expand'}
                >
                    {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {items.map(item => {
                    const isActive = currentUrl === item.href || (currentUrl.startsWith(item.href) && item.href !== '/staff/appointments' && item.href !== '/dentist/appointments' && item.href !== '/patient/appointments')
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                                isActive
                                    ? 'bg-teal-500 text-white shadow-md'
                                    : 'text-white hover:bg-[#2a6f6a] text-gray-100'
                            }`}
                            title={item.label}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {isOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* User Info */}
            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                <div className="text-center">
                    <p className="text-xs text-gray-300 mb-2">Logged in as:</p>
                    <div className="flex items-center justify-center gap-2">
                        {!isOpen ? (
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {getInitials(auth.user.name)}
                            </div>
                        ) : (
                            <>
                                <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {auth.user.role.toUpperCase()}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}