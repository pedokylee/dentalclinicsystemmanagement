import StaffLayout from '@/Layouts/StaffLayout'
import { router } from '@inertiajs/react'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function CheckinIndex({ appointments }) {
    const [search, setSearch] = useState('')

    const filteredAppointments = useMemo(() => {
        if (!search.trim()) {
            return appointments
        }

        const query = search.toLowerCase()
        return appointments.filter((appointment) =>
            appointment.patient.full_name.toLowerCase().includes(query) ||
            appointment.patient.first_name.toLowerCase().includes(query) ||
            appointment.patient.last_name.toLowerCase().includes(query)
        )
    }, [appointments, search])

    return (
        <div className="dcms-page">
            <div>
                <h1 className="dcms-page-title">Walk-in Check-in</h1>
                <p className="dcms-page-subtitle">Search the day&apos;s patients, review their appointment details, and mark them as checked in in real time.</p>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <label className="dcms-label">Search patient</label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--dcms-primary)]" />
                        <input className="dcms-input pl-12" placeholder="Search by patient name" value={search} onChange={(event) => setSearch(event.target.value)} />
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
                                <th>Date</th>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? filteredAppointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="font-semibold">{appointment.patient.full_name}</td>
                                    <td>{appointment.dentist.user.name}</td>
                                    <td>{appointment.appointment_date}</td>
                                    <td>{appointment.appointment_time}</td>
                                    <td>{appointment.type}</td>
                                    <td>
                                        <span className={appointment.status === 'confirmed' ? 'dcms-chip-teal' : 'dcms-chip-gold'}>
                                            {appointment.status === 'confirmed' ? 'Checked In' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="dcms-btn-primary !px-3 !py-2"
                                            disabled={appointment.status === 'confirmed'}
                                            onClick={() => router.patch(`/staff/checkin/${appointment.id}`)}
                                        >
                                            Mark as Checked In
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-[var(--dcms-text-soft)]">No appointment matched your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

CheckinIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
