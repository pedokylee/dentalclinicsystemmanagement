import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'

export default function Sidebar() {
    const { auth } = usePage().props
    const currentUrl = usePage().url
    const [isOpen, setIsOpen] = useState(true)

    if (!auth?.user) return null

    const role = auth.user.role

    const navItems = {
        admin: [
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'User Management', href: '/admin/users' },
            { label: 'Reports', href: '/admin/reports' },
            { label: 'Audit Log', href: '/admin/audit-log' },
            { label: 'Backup', href: '/admin/backup' },
            { label: 'Configuration', href: '/admin/config' },
        ],
        dentist: [
            { label: 'Dashboard', href: '/dentist/dashboard' },
            { label: 'My Patients', href: '/dentist/patients' },
            { label: 'Treatment Record', href: '/dentist/treatment/create' },
            { label: 'My Appointments', href: '/dentist/appointments' },
        ],
        staff: [
            { label: 'Dashboard', href: '/staff/dashboard' },
            { label: 'Register Patient', href: '/staff/patients/create' },
            { label: 'Book Appointment', href: '/staff/appointments/create' },
            { label: 'Appointments', href: '/staff/appointments' },
            { label: 'Check-in', href: '/staff/checkin' },
        ],
        patient: [
            { label: 'Dashboard', href: '/patient/dashboard' },
            { label: 'My Profile', href: '/patient/profile' },
            { label: 'My Appointments', href: '/patient/appointments' },
            { label: 'Treatment History', href: '/patient/history' },
            { label: 'Notifications', href: '/patient/notifications' },
        ],
    }

    const items = navItems[role] || []

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-[#071F1D] min-h-screen text-[#E2FAF7] flex flex-col p-4 gap-4 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-[#0D9488] truncate">{isOpen ? 'DCMS' : 'D'}</span>
                <button onClick={() => setIsOpen(!isOpen)} className="text-[#7ABFB9] hover:text-[#0D9488]">
                    {isOpen ? '←' : '→'}
                </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {items.map(item => {
                    const isActive = currentUrl === item.href || currentUrl.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-2 rounded transition-colors truncate text-sm ${
                                isActive
                                    ? 'bg-[#0D9488] text-white'
                                    : 'hover:bg-[#0F2724] text-[#7ABFB9] hover:text-[#2DD4BF]'
                            }`}
                            title={item.label}
                        >
                            {isOpen ? item.label : item.label.charAt(0)}
                        </Link>
                    )
                })}
            </nav>

            <div className="text-xs text-[#4A8C85] text-center pt-4 border-t border-[rgba(45,212,191,0.12)]">
                {isOpen ? auth.user.name : auth.user.name.charAt(0)}
            </div>
        </aside>
    )
}