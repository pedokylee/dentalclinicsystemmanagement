import { Link, router } from '@inertiajs/react';
import { Bell, CheckCheck, Clock3, Trash2 } from 'lucide-react';
import StaffLayout from '@/Layouts/StaffLayout';

const palette = {
    appointment_cancelled: 'border-red-200 bg-red-50',
    appointment_booked: 'border-teal-200 bg-teal-50',
    appointment_confirmed: 'border-teal-200 bg-teal-50',
    appointment_reminder: 'border-amber-200 bg-amber-50',
};

const refreshOptions = {
    preserveState: true,
    preserveScroll: true,
    replace: true,
    only: ['notifications', 'unreadCount', 'auth'],
};

export default function NotificationsIndex({ notifications, unreadCount }) {
    const markAllAsRead = () => {
        router.post('/staff/notifications/mark-all-read', {}, refreshOptions);
    };

    const markAsRead = (id) => {
        router.patch(`/staff/notifications/${id}/read`, {}, refreshOptions);
    };

    const dismiss = (id) => {
        router.delete(`/staff/notifications/${id}`, refreshOptions);
    };

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Notifications</h1>
                    <p className="dcms-page-subtitle">
                        {unreadCount} unread notification{unreadCount === 1 ? '' : 's'} for bookings, reminders, and clinic follow-ups.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="dcms-btn-primary" onClick={markAllAsRead}>
                        Mark All as Read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.data.length > 0 ? notifications.data.map((notification) => (
                    <section
                        key={notification.id}
                        className={`rounded-2xl border p-5 ${palette[notification.type] ?? 'border-slate-200 bg-slate-50'} ${!notification.read ? 'ring-1 ring-[var(--dcms-primary)]/20' : ''}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dcms-primary)] text-white">
                                    {notification.type === 'appointment_reminder' ? <Clock3 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--dcms-text)]">{notification.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{notification.message}</p>
                                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--dcms-text-soft)]">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!notification.read && (
                                    <button className="dcms-btn-secondary !px-3 !py-2" onClick={() => markAsRead(notification.id)}>
                                        <CheckCheck className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    className="dcms-btn-secondary !border-red-200 !text-red-600 !px-3 !py-2 hover:!bg-red-50"
                                    onClick={() => dismiss(notification.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                )) : (
                    <section className="dcms-card">
                        <div className="dcms-card-body text-center text-[var(--dcms-text-soft)]">No notifications yet.</div>
                    </section>
                )}
            </div>

            {notifications.links?.length > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                    {notifications.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                className={`rounded px-3 py-2 text-sm ${link.active ? 'bg-[var(--dcms-primary)] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={link.label}
                                className="cursor-not-allowed rounded bg-slate-100 px-3 py-2 text-sm text-slate-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}

NotificationsIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>;
