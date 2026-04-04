import StaffLayout from '@/Layouts/StaffLayout'
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function CheckinIndex({ appointments }) {
    const [checkedIn, setCheckedIn] = useState({})

    const handleCheckIn = (appointmentId) => {
        router.patch(
            `/staff/checkin/${appointmentId}`,
            {},
            {
                onSuccess: () => {
                    setCheckedIn({
                        ...checkedIn,
                        [appointmentId]: true,
                    })
                },
            }
        )
    }

    const getStatusBadge = (status, appointmentId) => {
        if (checkedIn[appointmentId] || status === 'confirmed') {
            return (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ Checked In
                </span>
            )
        }
        return (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Pending
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#E2FAF7]">Patient Check-In</h1>
                <p className="text-[#92A9B4] mt-2">Manage today's patient arrivals</p>
            </div>

            {/* Appointments List */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg overflow-hidden">
                {appointments && appointments.length > 0 ? (
                    <table className="w-full">
                        <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-[#0D9488]">Time</th>
                                <th className="px-6 py-3 text-left text-[#0D9488]">Patient Name</th>
                                <th className="px-6 py-3 text-left text-[#0D9488]">Dentist</th>
                                <th className="px-6 py-3 text-left text-[#0D9488]">Type</th>
                                <th className="px-6 py-3 text-left text-[#0D9488]">Status</th>
                                <th className="px-6 py-3 text-center text-[#0D9488]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr
                                    key={appointment.id}
                                    className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724] transition-colors text-[#E2FAF7]"
                                >
                                    <td className="px-6 py-4 font-semibold">{appointment.appointment_time}</td>
                                    <td className="px-6 py-4">{appointment.patient.full_name}</td>
                                    <td className="px-6 py-4">{appointment.dentist.user.name}</td>
                                    <td className="px-6 py-4">{appointment.type}</td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(appointment.status, appointment.id)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {appointment.status === 'confirmed' || checkedIn[appointment.id] ? (
                                            <span className="text-[#0D9488] font-medium">✓ Done</span>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckIn(appointment.id)}
                                                className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors text-sm font-medium"
                                            >
                                                Check In
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[#92A9B4] text-lg">No appointments scheduled for today</p>
                        <p className="text-[#5A7A82] text-sm mt-1">Check back later or book new appointments</p>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {appointments && appointments.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-4 rounded-lg">
                        <p className="text-[#92A9B4] text-sm">Total Appointments</p>
                        <p className="text-2xl font-bold text-[#0D9488] mt-2">{appointments.length}</p>
                    </div>
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-4 rounded-lg">
                        <p className="text-[#92A9B4] text-sm">Checked In</p>
                        <p className="text-2xl font-bold text-green-500 mt-2">
                            {Object.values(checkedIn).filter(Boolean).length +
                                appointments.filter((a) => a.status === 'confirmed').length}
                        </p>
                    </div>
                    <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-4 rounded-lg">
                        <p className="text-[#92A9B4] text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-500 mt-2">
                            {appointments.length -
                                (Object.values(checkedIn).filter(Boolean).length +
                                    appointments.filter((a) => a.status === 'confirmed').length)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

CheckinIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
