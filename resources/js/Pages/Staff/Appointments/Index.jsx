import StaffLayout from '@/Layouts/StaffLayout'
import { Link } from '@inertiajs/react'

export default function AppointmentsIndex({ appointments }) {
    const handleExportPdf = () => {
        window.location.href = route('staff.appointments.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('staff.appointments.export-excel')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">Appointments</h1>
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
                    <Link
                        href="/staff/appointments/create"
                        className="px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6]"
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Patient</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Dentist</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Date & Time</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Status</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { appointments.data.map((apt) => (
                            <tr key={apt.id} className="border-b hover:bg-[#0F2724] text-[#E2FAF7]">
                                <td className="px-6 py-3">{apt.patient.full_name}</td>
                                <td className="px-6 py-3">Dr. {apt.dentist.user.name}</td>
                                <td className="px-6 py-3">{apt.appointment_date} {apt.appointment_time}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-3 py-1 rounded text-xs ${apt.status === 'confirmed' ? 'bg-[#0D9488]' : 'bg-[#F59E0B]'} text-white`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 space-x-2">
                                    <Link href={`/staff/appointments/${apt.id}/edit`} className="text-[#0D9488]">Edit</Link>
                                    <button className="text-red-500">Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

AppointmentsIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
