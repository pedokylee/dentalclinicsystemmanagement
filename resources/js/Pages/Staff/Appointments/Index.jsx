import StaffLayout from '@/Layouts/StaffLayout'
import { Link, router } from '@inertiajs/react'
import { Bell, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function AppointmentsIndex({ appointments, dentists, filters }) {
    const [form, setForm] = useState({
        search: filters?.search ?? '',
        dentist: filters?.dentist ?? 'all',
        date: filters?.date ?? '',
        status: filters?.status ?? 'all',
    })

    const rows = appointments?.data ?? []

    const applyFilters = () => {
        router.get('/staff/appointments', form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['appointments', 'filters'],
        })
    }

    const cancelAppointment = (id) => {
        if (confirm('Cancel this appointment?')) {
            router.delete(`/staff/appointments/${id}`)
        }
    }

    const sendReminder = (id) => {
        router.post(`/staff/appointments/${id}/reminder`)
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Appointment Management</h1>
                    <p className="dcms-page-subtitle">Filter, reschedule, cancel, and send email or in-app reminders for clinic appointments.</p>
                </div>
                <div className="flex gap-3">
                    <a href="/staff/appointments/export/pdf" className="dcms-btn-gold">Export PDF</a>
                    <a href="/staff/appointments/export/excel" className="dcms-btn-secondary">Export Excel</a>
                    <Link href="/staff/appointments/create" className="dcms-btn-primary">Book Appointment</Link>
                </div>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-5">
                        <div>
                            <label className="dcms-label">Search</label>
                            <input className="dcms-input" value={form.search} onChange={(event) => setForm({ ...form, search: event.target.value })} placeholder="Patient or appointment ID" />
                        </div>
                        <div>
                            <label className="dcms-label">Dentist</label>
                            <select className="dcms-select" value={form.dentist} onChange={(event) => setForm({ ...form, dentist: event.target.value })}>
                                <option value="all">All dentists</option>
                                {dentists.map((dentist) => (
                                    <option key={dentist.id} value={dentist.id}>{dentist.user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="dcms-label">Date</label>
                            <input type="date" className="dcms-input" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
                        </div>
                        <div>
                            <label className="dcms-label">Status</label>
                            <select className="dcms-select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                                <option value="all">All statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="dcms-btn-primary w-full" onClick={applyFilters}>Apply Filters</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dcms-card">
                <div className="overflow-x-auto">
                    <table className="dcms-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Dentist</th>
                                <th>Date / Time</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="font-semibold">{appointment.patient.full_name}</td>
                                    <td>{appointment.dentist.user.name}</td>
                                    <td>{appointment.appointment_date} - {appointment.appointment_time}</td>
                                    <td>{appointment.type}</td>
                                    <td>
                                        <span className={appointment.status === 'confirmed' || appointment.status === 'scheduled' ? 'dcms-chip-teal' : appointment.status === 'cancelled' ? 'dcms-chip-red' : 'dcms-chip-gold'}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="dcms-btn-secondary !px-3 !py-2 disabled:opacity-50"
                                                onClick={() => sendReminder(appointment.id)}
                                                title="Send reminder"
                                                disabled={appointment.status === 'cancelled'}
                                            >
                                                <Bell className="h-4 w-4" />
                                            </button>
                                            <Link className="dcms-btn-primary !px-3 !py-2" href={`/staff/appointments/${appointment.id}/edit`} title="Reschedule">
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button className="dcms-btn-secondary !border-red-200 !text-red-600 !px-3 !py-2 hover:!bg-red-50" onClick={() => cancelAppointment(appointment.id)} title="Cancel">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

AppointmentsIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
