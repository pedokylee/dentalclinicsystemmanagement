import DentistLayout from '@/Layouts/DentistLayout'
import Calendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function AppointmentsIndex({ appointments }) {
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [showDetails, setShowDetails] = useState(false)

    const handleEventClick = (info) => {
        const appointment = appointments.find(apt => apt.id == info.event.id)
        setSelectedAppointment(appointment)
        setShowDetails(true)
    }

    const handleCancelAppointment = () => {
        if (!selectedAppointment) return
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.delete(`/dentist/appointments/${selectedAppointment.id}`, {
                onSuccess: () => {
                    setShowDetails(false)
                    setSelectedAppointment(null)
                }
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">My Appointments</h1>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <Calendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={appointments}
                    headerToolbar={{left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek'}}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>

            {showDetails && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-[#E2FAF7] mb-4">Appointment Details</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div>
                                <p className="text-[#7ABFB9] text-sm">Patient</p>
                                <p className="text-[#E2FAF7] font-semibold">{selectedAppointment.title}</p>
                            </div>
                            <div>
                                <p className="text-[#7ABFB9] text-sm">Date & Time</p>
                                <p className="text-[#E2FAF7] font-semibold">{selectedAppointment.start}</p>
                            </div>
                            <div>
                                <p className="text-[#7ABFB9] text-sm">Type</p>
                                <p className="text-[#E2FAF7] font-semibold">{selectedAppointment.type}</p>
                            </div>
                            <div>
                                <p className="text-[#7ABFB9] text-sm">Status</p>
                                <p className="text-[#E2FAF7] font-semibold capitalize">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        selectedAppointment.status === 'confirmed' ? 'bg-green-600' :
                                        selectedAppointment.status === 'cancelled' ? 'bg-red-600' :
                                        'bg-yellow-600'
                                    }`}>
                                        {selectedAppointment.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {selectedAppointment.status !== 'cancelled' && (
                                <button
                                    onClick={handleCancelAppointment}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cancel Appointment
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowDetails(false)
                                    setSelectedAppointment(null)
                                }}
                                className="flex-1 px-4 py-2 bg-[#0F2724] text-[#7ABFB9] rounded hover:bg-[#0E2C28]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

AppointmentsIndex.layout = (page) => <DentistLayout>{page}</DentistLayout>
