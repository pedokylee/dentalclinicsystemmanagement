import DentistLayout from '@/Layouts/DentistLayout'
import Calendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function AppointmentsIndex({ appointments }) {
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    return (
        <div className="dcms-page">
            <div>
                <h1 className="dcms-page-title">My Appointments</h1>
                <p className="dcms-page-subtitle">Month, week, and day views are limited to your own schedule and patient list.</p>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <Calendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={appointments}
                        eventClick={(info) => setSelectedAppointment(appointments.find((appointment) => String(appointment.id) === info.event.id))}
                        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                        height="auto"
                    />
                </div>
            </section>

            {selectedAppointment && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(6,26,24,0.45)] px-4">
                    <div className="dcms-card w-full max-w-lg">
                        <div className="dcms-card-body">
                            <h2 className="text-2xl">Appointment Details</h2>
                            <div className="mt-5 space-y-3 text-sm">
                                <div className="dcms-card-muted"><strong>Patient:</strong> {selectedAppointment.title}</div>
                                <div className="dcms-card-muted"><strong>Date & Time:</strong> {selectedAppointment.start}</div>
                                <div className="dcms-card-muted"><strong>Type:</strong> {selectedAppointment.type}</div>
                                <div className="dcms-card-muted"><strong>Status:</strong> {selectedAppointment.status}</div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                {selectedAppointment.status !== 'cancelled' && (
                                    <button
                                        className="dcms-btn-secondary !border-red-200 !text-red-600 hover:!bg-red-50"
                                        onClick={() => {
                                            router.delete(`/dentist/appointments/${selectedAppointment.id}`)
                                            setSelectedAppointment(null)
                                        }}
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                                <button className="dcms-btn-primary" onClick={() => setSelectedAppointment(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

AppointmentsIndex.layout = (page) => <DentistLayout>{page}</DentistLayout>
