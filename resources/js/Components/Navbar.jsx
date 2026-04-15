import { Link, router, usePage } from '@inertiajs/react'
import { Bell, ChevronRight, LogOut } from 'lucide-react'
import { useMemo } from 'react'

const NOTIFICATION_ROUTES = {
    dentist: {
        count: '/dentist/notifications/unread-count',
        index: '/dentist/notifications',
    },
    staff: {
        count: '/staff/notifications/unread-count',
        index: '/staff/notifications',
    },
    patient: {
        count: '/patient/notifications/unread-count',
        index: '/patient/notifications',
    },
}

const ROLE_LABELS = {
    admin: 'Administrator',
    dentist: 'Dentist',
    staff: 'Staff',
    patient: 'Patient',
}

export default function Navbar() {
    const { auth } = usePage().props
    const page = usePage()

    const breadcrumb = useMemo(() => {
        return page.url
            .split('?')[0]
            .split('/')
            .filter(Boolean)
            .map((segment) =>
                segment
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (letter) => letter.toUpperCase())
            )
    }, [page.url])

    if (!auth?.user) {
        return null
    }

    const role = auth.user.role
    const unreadCount = auth.unreadNotifications ?? 0
    const notificationRoute = NOTIFICATION_ROUTES[role]?.index
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--dcms-border)] bg-white/90 px-8 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--dcms-text-soft)]">
                    {breadcrumb.map((item, index) => (
                        <div key={`${item}-${index}`} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="h-4 w-4" />}
                            <span className={index === breadcrumb.length - 1 ? 'font-semibold text-[var(--dcms-text)]' : ''}>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {notificationRoute ? (
                        <Link prefetch href={notificationRoute} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dcms-surface)] text-[var(--dcms-primary)] transition hover:bg-[var(--dcms-surface-strong)]">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dcms-gold)] px-1 text-[10px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dcms-surface)] text-[var(--dcms-primary)]">
                            <Bell className="h-5 w-5" />
                        </div>
                    )}

                    <div className="flex items-center gap-3 rounded-2xl border border-[var(--dcms-border)] bg-white px-3 py-2 shadow-sm">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--dcms-text)]">{auth.user.name}</p>
                            <p className="text-xs text-[var(--dcms-text-soft)]">{ROLE_LABELS[role] ?? role}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dcms-deep-teal)] font-bold text-white">
                            {initials}
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                            {role}
                        </span>
                        <button
                            onClick={() => router.post('/logout')}
                            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-500"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
