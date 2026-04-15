import { Link, usePage } from '@inertiajs/react'
import {
    Activity,
    Bell,
    CalendarDays,
    ClipboardList,
    Database,
    FileBarChart2,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Stethoscope,
    UserRound,
    Users,
} from 'lucide-react'

const NAV_ITEMS = {
    admin: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'User Management', href: '/admin/users', icon: Users },
        { label: 'Reports', href: '/admin/reports', icon: FileBarChart2 },
        { label: 'Audit Log', href: '/admin/audit-log', icon: ShieldCheck },
        { label: 'Backup & Restore', href: '/admin/backup', icon: Database },
        { label: 'System Config', href: '/admin/config', icon: Settings },
        { label: 'User Settings', href: '/admin/profile', icon: UserRound },
    ],
    dentist: [
        { label: 'Dashboard', href: '/dentist/dashboard', icon: LayoutDashboard },
        { label: 'My Patients', href: '/dentist/patients', icon: Users },
        { label: 'Treatment Record', href: '/dentist/treatment/create', icon: ClipboardList },
        { label: 'My Appointments', href: '/dentist/appointments', icon: CalendarDays },
        { label: 'Notifications', href: '/dentist/notifications', icon: Bell },
        { label: 'User Settings', href: '/dentist/profile', icon: Settings },
    ],
    staff: [
        { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
        { label: 'Patient Inquiries', href: '/staff/inquiries', icon: ClipboardList },
        { label: 'Register Patient', href: '/staff/patients/create', icon: UserRound },
        { label: 'Book Appointment', href: '/staff/appointments/create', icon: CalendarDays },
        { label: 'Appointments', href: '/staff/appointments', icon: ClipboardList },
        { label: 'Walk-in Check-in', href: '/staff/checkin', icon: Activity },
        { label: 'Reports', href: '/staff/reports', icon: FileBarChart2 },
        { label: 'Notifications', href: '/staff/notifications', icon: Bell },
        { label: 'User Settings', href: '/staff/profile', icon: Settings },
    ],
    patient: [
        { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
        { label: 'Profile & Settings', href: '/patient/profile', icon: Settings },
        { label: 'My Appointments', href: '/patient/appointments', icon: CalendarDays },
        { label: 'Treatment History', href: '/patient/history', icon: ClipboardList },
        { label: 'Notifications', href: '/patient/notifications', icon: Bell },
    ],
}

export default function Sidebar() {
    const { auth } = usePage().props
    const currentUrl = usePage().url

    if (!auth?.user) {
        return null
    }

    const items = NAV_ITEMS[auth.user.role] || []

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-[var(--dcms-bg)] px-4 py-5 text-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="dcms-icon-badge h-12 w-12 bg-[var(--dcms-primary)]">
                    <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-lg font-bold tracking-wide text-white">DCMS</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-light)]">Clinic Portal</p>
                </div>
            </div>

            <nav className="mt-6 flex-1 space-y-2 overflow-y-auto">
                {items.map(({ href, label, icon: Icon }) => {
                    const active = (() => {
                        if (currentUrl === href) {
                            return true
                        }

                        if (href === '/staff/appointments') {
                            return currentUrl.startsWith('/staff/appointments/') && !currentUrl.startsWith('/staff/appointments/create')
                        }

                        return currentUrl.startsWith(`${href}/`)
                    })()

                    return (
                        <Link
                            key={href}
                            href={href}
                            prefetch
                            className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                                active
                                    ? 'bg-white/10 text-white'
                                    : 'text-[#c8eeea] hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-[var(--dcms-primary)]' : 'bg-[var(--dcms-deep-teal)]'}`}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-semibold">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--dcms-light)]">Logged In Role</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{auth.user.name}</span>
                    <span className="rounded-full bg-[var(--dcms-gold)] px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-white">
                        {auth.user.role}
                    </span>
                </div>
            </div>
        </aside>
    )
}
