import PatientLayout from '@/Layouts/PatientLayout'
import { router } from '@inertiajs/react'

const palette = {
    appointment_reminder: 'border-teal-200 bg-teal-50',
    appointment_booked: 'border-teal-200 bg-teal-50',
    appointment_cancelled: 'border-red-200 bg-red-50',
    appointment_confirmed: 'border-teal-200 bg-teal-50',
    overdue_record_alert: 'border-amber-200 bg-amber-50',
}

export default function NotificationsIndex({ notifications, unreadCount }) {
    const refreshOptions = {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['notifications', 'unreadCount', 'auth'],
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Notifications</h1>
                    <p className="dcms-page-subtitle">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'} across appointment reminders and clinic messages.</p>
                </div>
                {unreadCount > 0 && (
                    <button className="dcms-btn-primary" onClick={() => router.post('/patient/notifications/mark-all-read', {}, refreshOptions)}>
                        Mark All as Read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.data.length > 0 ? notifications.data.map((notification) => (
                    <section key={notification.id} className={`rounded-2xl border p-5 ${palette[notification.type] ?? 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-semibold text-[var(--dcms-text)]">{notification.title}</p>
                                <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{notification.message}</p>
                                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--dcms-text-soft)]">{new Date(notification.created_at).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                {!notification.read && (
                                    <button className="dcms-btn-secondary !px-3 !py-2" onClick={() => router.patch(`/patient/notifications/${notification.id}/read`, {}, refreshOptions)}>
                                        Mark Read
                                    </button>
                                )}
                                <button className="dcms-btn-secondary !border-red-200 !text-red-600 !px-3 !py-2 hover:!bg-red-50" onClick={() => router.delete(`/patient/notifications/${notification.id}`, refreshOptions)}>
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </section>
                )) : (
                    <section className="dcms-card">
                        <div className="dcms-card-body text-center text-[var(--dcms-text-soft)]">No notifications at the moment.</div>
                    </section>
                )}
            </div>
        </div>
    )
}

NotificationsIndex.layout = (page) => <PatientLayout>{page}</PatientLayout>
