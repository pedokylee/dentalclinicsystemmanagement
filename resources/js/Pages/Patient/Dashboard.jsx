import PatientLayout from '@/Layouts/PatientLayout'
import { Link } from '@inertiajs/react'
import { Bell, CalendarDays, ClipboardList } from 'lucide-react'

export default function Dashboard({ nextAppointment, notifications }) {
    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Patient Dashboard</h1>
                    <p className="dcms-page-subtitle">View your upcoming appointment, treatment timeline, and clinic notifications in one place.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/patient/history" className="dcms-btn-secondary">My Records</Link>
                    <Link href="/patient/appointments" className="dcms-btn-primary">My Appointments</Link>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="dcms-icon-badge">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl">Upcoming Appointment</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Your next booked visit with the clinic.</p>
                            </div>
                        </div>

                        {nextAppointment ? (
                            <div className="grid gap-4 rounded-2xl border border-[var(--dcms-border)] bg-[var(--dcms-surface)] p-5 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Dentist</p>
                                    <p className="mt-2 font-semibold">Dr. {nextAppointment.dentist?.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Status</p>
                                    <p className="mt-2">
                                        <span className={nextAppointment.status === 'confirmed' ? 'dcms-chip-teal' : 'dcms-chip-gold'}>{nextAppointment.status}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Date</p>
                                    <p className="mt-2 font-semibold">{nextAppointment.appointment_date}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--dcms-text-soft)]">Time</p>
                                    <p className="mt-2 font-semibold">{nextAppointment.appointment_time}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[var(--dcms-border)] p-8 text-center text-[var(--dcms-text-soft)]">
                                No upcoming appointments have been scheduled yet.
                            </div>
                        )}
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="dcms-icon-badge">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl">Notifications</h2>
                                    <p className="text-sm text-[var(--dcms-text-soft)]">Reminders, follow-ups, and clinic notices.</p>
                                </div>
                            </div>
                            <Link href="/patient/notifications" className="text-sm font-semibold text-[var(--dcms-primary)]">View all</Link>
                        </div>

                        <div className="space-y-3">
                            {notifications.length > 0 ? notifications.map((notification) => (
                                <div key={notification.id} className={`rounded-2xl border p-4 ${notification.type?.includes('reminder') ? 'border-teal-200 bg-teal-50' : notification.type?.includes('alert') ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="font-semibold text-[var(--dcms-text)]">{notification.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{notification.message}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-[var(--dcms-text-soft)]">You have no new notifications.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="dcms-icon-badge">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl">Treatment History</h2>
                            <p className="text-sm text-[var(--dcms-text-soft)]">Download visit records and review procedures from previous appointments.</p>
                        </div>
                    </div>
                    <Link href="/patient/history" className="dcms-btn-secondary">Open Timeline</Link>
                </div>
            </section>
        </div>
    )
}

Dashboard.layout = (page) => <PatientLayout>{page}</PatientLayout>
