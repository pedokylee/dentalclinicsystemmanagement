import DentistLayout from '@/Layouts/DentistLayout'
import StatCard from '@/Components/StatCard'
import { Link } from '@inertiajs/react'
import { CalendarDays, ClipboardList, Users } from 'lucide-react'

export default function Dashboard({ todaySchedule, pendingNotes, myPatientsCount }) {
    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Dentist Dashboard</h1>
                    <p className="dcms-page-subtitle">Review today&apos;s schedule, track assigned patients, and complete any pending treatment records.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dentist/patients" className="dcms-btn-secondary">View My Patients</Link>
                    <Link href="/dentist/appointments" className="dcms-btn-primary">My Appointments</Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Assigned Patients" value={myPatientsCount} icon={<Users className="h-5 w-5" />} />
                <StatCard label="Today&apos;s Appointments" value={todaySchedule.length} icon={<CalendarDays className="h-5 w-5" />} />
                <StatCard label="Pending Notes" value={pendingNotes} icon={<ClipboardList className="h-5 w-5" />} />
            </div>

            {pendingNotes > 0 && (
                <div className="dcms-callout-gold">
                    <p className="font-semibold text-amber-900">Pending treatment notes</p>
                    <p className="mt-1 text-sm text-amber-800">{pendingNotes} visit record{pendingNotes > 1 ? 's are' : ' is'} still waiting for final notes or updates.</p>
                </div>
            )}

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl">Today&apos;s Schedule</h2>
                            <p className="text-sm text-[var(--dcms-text-soft)]">Timeline of your confirmed and pending patient visits.</p>
                        </div>
                        <Link href="/dentist/treatment/create" className="dcms-btn-secondary">Add Treatment Record</Link>
                    </div>

                    <div className="space-y-4">
                        {todaySchedule.length > 0 ? todaySchedule.map((appointment) => (
                            <div key={appointment.id} className="rounded-2xl border border-[var(--dcms-border)] bg-[var(--dcms-surface)] p-5">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-[var(--dcms-text)]">{appointment.patient}</p>
                                        <p className="mt-1 text-sm text-[var(--dcms-text-soft)]">{appointment.type}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="dcms-chip-teal">{appointment.time}</span>
                                        <Link href="/dentist/patients" className="text-sm font-semibold text-[var(--dcms-primary)]">Open Patient List</Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="rounded-2xl border border-dashed border-[var(--dcms-border)] p-10 text-center text-[var(--dcms-text-soft)]">
                                No appointments scheduled for today.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

Dashboard.layout = (page) => <DentistLayout>{page}</DentistLayout>
