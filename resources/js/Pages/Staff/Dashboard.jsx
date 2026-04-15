import StaffLayout from '@/Layouts/StaffLayout'
import StatCard from '@/Components/StatCard'
import { Link, router } from '@inertiajs/react'
import { Bell, CalendarDays, ClipboardCheck, SearchCheck, UserPlus, Users } from 'lucide-react'

export default function Dashboard({ todayCheckIns, checkInQueue, walkInCount, remindersToSend, pendingInquiries }) {
    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Staff Dashboard</h1>
                    <p className="dcms-page-subtitle">Manage arrivals, bookings, patient registration, and reminder workflows from one front-desk view.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/staff/patients/create" className="dcms-btn-secondary"><UserPlus className="h-4 w-4" /> Register Patient</Link>
                    <Link href="/staff/appointments/create" className="dcms-btn-primary"><CalendarDays className="h-4 w-4" /> Book Appointment</Link>
                </div>
            </div>

            {remindersToSend > 0 && (
                <div className="dcms-callout-gold flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Bell className="mt-0.5 h-5 w-5 text-amber-600" />
                        <div>
                            <p className="font-semibold text-amber-900">Reminder queue ready</p>
                            <p className="text-sm text-amber-800">{remindersToSend} patient reminder{remindersToSend > 1 ? 's' : ''} are due tomorrow through email and in-app notifications.</p>
                        </div>
                    </div>
                    <Link href="/staff/appointments" className="dcms-btn-gold">Open Appointments</Link>
                </div>
            )}

            {pendingInquiries > 0 && (
                <div className="dcms-card border-l-[3px] border-l-[var(--dcms-primary)]">
                    <div className="dcms-card-body flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="dcms-icon-badge h-10 w-10">
                                <SearchCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--dcms-text)]">New patient inquiries need review</p>
                                <p className="text-sm text-[var(--dcms-text-soft)]">{pendingInquiries} landing-page submission{pendingInquiries > 1 ? 's are' : ' is'} waiting for verification and conversion into patient records.</p>
                            </div>
                        </div>
                        <Link href="/staff/inquiries" className="dcms-btn-primary">Review Inquiries</Link>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Today&apos;s Queue" value={checkInQueue.length} icon={<CalendarDays className="h-5 w-5" />} />
                <StatCard label="Checked In" value={todayCheckIns} icon={<ClipboardCheck className="h-5 w-5" />} />
                <StatCard label="Walk-ins" value={walkInCount} icon={<Users className="h-5 w-5" />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl">Today&apos;s Check-in Queue</h2>
                                <p className="text-sm text-[var(--dcms-text-soft)]">Arriving patients can be checked in directly from the queue.</p>
                            </div>
                            <Link href="/staff/checkin" className="dcms-btn-secondary">Open Check-in</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="dcms-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Dentist</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkInQueue.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.time}</td>
                                            <td className="font-semibold">{appointment.patient}</td>
                                            <td>{appointment.dentist}</td>
                                            <td>{appointment.type}</td>
                                            <td>
                                                <span className={appointment.status === 'confirmed' ? 'dcms-chip-teal' : 'dcms-chip-gold'}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="dcms-btn-primary !px-3 !py-2" onClick={() => router.patch(`/staff/checkin/${appointment.id}`)}>
                                                    Check In
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="dcms-card">
                        <div className="dcms-card-body">
                            <h2 className="mb-4 text-xl">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link href="/staff/patients/create" className="dcms-card-muted flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><UserPlus className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Register Patient</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">Create a new clinic profile.</p>
                                    </div>
                                </Link>
                                <Link href="/staff/appointments/create" className="dcms-card-muted flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><CalendarDays className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Book Appointment</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">Schedule a patient visit.</p>
                                    </div>
                                </Link>
                                <Link href="/staff/inquiries" className="dcms-card-muted flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><SearchCheck className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Patient Inquiries</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">Verify landing-page submissions and convert them into clinic records.</p>
                                    </div>
                                </Link>
                                <Link href="/staff/reports" className="dcms-card-muted flex items-center gap-3">
                                    <div className="dcms-icon-badge h-10 w-10"><ClipboardCheck className="h-4 w-4" /></div>
                                    <div>
                                        <p className="font-semibold">Basic Reports</p>
                                        <p className="text-sm text-[var(--dcms-text-soft)]">View read-only clinic summaries.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] bg-[var(--dcms-bg)] p-6 text-white shadow-xl">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--dcms-light)]">Operations</p>
                        <h2 className="mt-3 text-2xl text-white">Reminder delivery is built in.</h2>
                        <p className="mt-3 text-sm leading-6 text-[#cbecea]">Front-desk reminders are handled through email and in-app notifications, so the team can keep communication centralized inside the clinic workflow.</p>
                    </div>
                </section>
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <StaffLayout>{page}</StaffLayout>
