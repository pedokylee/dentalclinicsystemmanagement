import PatientLayout from '@/Layouts/PatientLayout'
import { Link } from '@inertiajs/react'

export default function AppointmentsIndex({ appointments }) {
    const handleExportPdf = () => {
        window.location.href = route('patient.appointments.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('patient.appointments.export-excel')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">My Appointments</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportPdf}
                        className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors text-sm"
                    >
                        Export PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 transition-colors text-sm"
                    >
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {appointments.data.length === 0 ? (
                    <div className="text-center py-8 text-[#7ABFB9]">No appointments scheduled</div>
                ) : (
                    appointments.data.map((apt) => (
                        <div
                            key={apt.id}
                            className="bg-[#0E2C28] border-l-4 border-[#0D9488] p-6 rounded flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold text-[#E2FAF7]">{apt.appointment_date} at {apt.appointment_time}</p>
                                <p className="text-[#7ABFB9]">Dr. {apt.dentist.user.name}</p>
                                <p className="text-sm text-[#4A8C85]">{apt.type}</p>
                            </div>
                            <div className="space-x-3">
                                <span className={`px-3 py-1 rounded text-xs font-semibold ${apt.status === 'confirmed' ? 'bg-[#0D9488]' : 'bg-[#F59E0B]'} text-white`}>
                                    {apt.status}
                                </span>
                                {apt.appointment_date > new Date().toISOString().split('T')[0] && (
                                    <button className="text-red-500 hover:text-red-600">Cancel</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

AppointmentsIndex.layout = (page) => <PatientLayout>{page}</PatientLayout>
