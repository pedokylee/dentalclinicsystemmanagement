import { useState, useMemo } from 'react'
import { router, Link } from '@inertiajs/react'
import { Search, CheckCircle, UserIcon, Bell } from 'lucide-react'

export default function CheckinIndex({ appointments }) {
    const [checkedIn, setCheckedIn] = useState({})
    const [searchQuery, setSearchQuery] = useState('')

    // Filter appointments based on search query
    const filteredAppointments = useMemo(() => {
        if (!searchQuery.trim()) return appointments

        const query = searchQuery.toLowerCase()
        return appointments.filter(
            (apt) =>
                apt.patient.full_name.toLowerCase().includes(query) ||
                apt.patient.first_name.toLowerCase().includes(query) ||
                apt.patient.last_name.toLowerCase().includes(query)
        )
    }, [appointments, searchQuery])

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

    const getStatusColor = (status, appointmentId) => {
        if (checkedIn[appointmentId] || status === 'confirmed') {
            return 'bg-teal-100 text-teal-700 border border-teal-200'
        }
        return 'bg-amber-100 text-amber-700 border border-amber-200'
    }

    const getStatusLabel = (status, appointmentId) => {
        if (checkedIn[appointmentId] || status === 'confirmed') {
            return 'Checked In'
        }
        return 'Pending'
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Walk In Check In</h1>
                        <p className="text-sm text-gray-500"></p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">Mark Receptionist</p>
                                <p className="text-xs text-gray-500">STAFF</p>
                            </div>
                            <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                MR
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full">
                {/* Header Section */}
                <div className="text-center py-12">
                    <h2 className="text-5xl font-bold text-gray-900 mb-3">Front Desk Check-in</h2>
                    <p className="text-gray-600 text-lg">Search for arriving patients to mark them as arrived</p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto px-6 mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0D9488] w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search patient by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 text-lg border-2 border-[#0D9488] rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 transition-all"
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-3xl mx-auto px-6 pb-12">
                    {filteredAppointments && filteredAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {filteredAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="grid grid-cols-4 gap-6 items-center">
                                        {/* Patient Info */}
                                        <div>
                                            <div className="w-14 h-14 bg-[#0D9488] text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                                                {appointment.patient.first_name[0]}
                                                {appointment.patient.last_name[0]}
                                            </div>
                                            <p className="font-semibold text-gray-900">{appointment.patient.full_name}</p>
                                            <p className="text-sm text-gray-500">{appointment.appointment_time}</p>
                                        </div>

                                        {/* Appointment Details */}
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Dentist</p>
                                            <p className="font-medium text-gray-900">Dr. {appointment.dentist.user.name}</p>
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Type</p>
                                            <p className="font-medium text-gray-900 capitalize">{appointment.type || 'Checkup'}</p>
                                        </div>

                                        {/* Status & Action */}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status, appointment.id)}`}>
                                                {getStatusLabel(appointment.status, appointment.id)}
                                            </span>

                                            {appointment.status === 'confirmed' || checkedIn[appointment.id] ? (
                                                <div className="flex items-center gap-2 text-[#0D9488] font-semibold">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Done
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckIn(appointment.id)}
                                                    className="px-6 py-2.5 bg-[#0D9488] hover:bg-[#0A7A70] text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    Check In
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm mb-2">Total</p>
                                    <p className="text-3xl font-bold text-gray-900">{filteredAppointments.length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm mb-2">Checked In</p>
                                    <p className="text-3xl font-bold text-teal-600">
                                        {Object.values(checkedIn).filter(Boolean).length +
                                            filteredAppointments.filter((a) => a.status === 'confirmed').length}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm mb-2">Pending</p>
                                    <p className="text-3xl font-bold text-amber-600">
                                        {filteredAppointments.length -
                                            (Object.values(checkedIn).filter(Boolean).length +
                                                filteredAppointments.filter((a) => a.status === 'confirmed').length)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                                <UserIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">No patient found</h2>
                            <p className="text-gray-600 mb-8">Would you like to register a new walk-in patient?</p>
                            <Link
                                href="/staff/patients/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D9488] hover:bg-[#0A7A70] text-white rounded-lg font-semibold transition-colors"
                            >
                                + Register New Patient
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

