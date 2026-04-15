import PatientLayout from '@/Layouts/PatientLayout'
import { router } from '@inertiajs/react'

export default function AppointmentsIndex({ appointments }) {
    const rows = appointments?.data ?? []

    const cancelAppointment = (appointmentId) => {
        if (confirm('Cancel this appointment?')) {
            router.delete(`/patient/appointments/${appointmentId}`)
        }
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">My Appointments</h1>
                    <p className="dcms-page-subtitle">View upcoming visits and past appointments. Booking remains managed by clinic staff.</p>
                </div>
                <div className="flex gap-3">
                    <a href={route('patient.appointments.export-pdf')} className="dcms-btn-gold">Export PDF</a>
                    <a href={route('patient.appointments.export-excel')} className="dcms-btn-secondary">Export Excel</a>
                </div>
            </div>

            <section className="dcms-card">
                <div className="overflow-x-auto">
                    <table className="dcms-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Dentist</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{appointment.appointment_date} - {appointment.appointment_time}</td>
                                    <td>{appointment.dentist.user.name}</td>
                                    <td>{appointment.type}</td>
                                    <td>
                                        <span className={appointment.status === 'confirmed' ? 'dcms-chip-teal' : appointment.status === 'cancelled' ? 'dcms-chip-red' : 'dcms-chip-gold'}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.status !== 'cancelled' && new Date(`${appointment.appointment_date}T${appointment.appointment_time}`) > new Date() ? (
                                            <button className="text-sm font-semibold text-red-600" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                                        ) : (
                                            <span className="text-sm text-[var(--dcms-text-soft)]">No action</span>
                                        )}
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

AppointmentsIndex.layout = (page) => <PatientLayout>{page}</PatientLayout>
