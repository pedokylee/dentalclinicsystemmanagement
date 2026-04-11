import StaffLayout from '@/Layouts/StaffLayout'
import { Link } from '@inertiajs/react'

const IconUsers = () => (
    <svg className="w-8 h-8 text-[#0D9488]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
)

const IconClock = () => (
    <svg className="w-8 h-8 text-[#0D9488]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
)

const IconBell = () => (
    <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.96 3.36 6.31 5.92 6.31 9v5l-2 2v1h15.69v-1l-2-2z" />
    </svg>
)

const IconRegister = () => (
    <svg className="w-6 h-6 text-[#0D9488]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 4c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5zm9 0c-.29 0-.62.02-.97.05 1.16.89 1.97 2.49 1.97 4.45V19h6v-1.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
)

const IconCalendar = () => (
    <svg className="w-6 h-6 text-[#0D9488]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v5h7v-5z" />
    </svg>
)

const IconFootsteps = () => (
    <svg className="w-6 h-6 text-[#0D9488]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8c0-1.657-.895-3.109-2.209-3.897A4 4 0 1012 20a4 4 0 001.791-7.897M9 12a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
)

export default function Dashboard({ todayCheckIns, remainingCheckIns, checkInQueue, walkInCount, waitingWalkIns, remindersToSend }) {
    const pendingReminders = remindersToSend > 0

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Staff Dashboard</h1>
                <p className="text-gray-500 text-sm">Dental Clinic Management System</p>
            </div>

            {/* Reminders Alert */}
            {pendingReminders && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg flex justify-between items-center shadow-sm">
                    <div>
                        <p className="font-semibold text-yellow-800 flex items-center gap-2">
                            <IconBell />
                            Reminders Needed
                        </p>
                        <p className="text-yellow-700 mt-1 text-sm">
                            {remindersToSend} patients need appointment reminders for tomorrow. Please send them via the Manage Appointments screen.
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded hover:bg-yellow-500 transition-colors whitespace-nowrap text-sm">
                        Send Now
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Check-in Queue Table */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Today's Check-in Queue</h3>
                        <Link href="/staff/checkin" className="text-[#0D9488] font-medium text-sm hover:text-[#0A7A70] transition-colors">
                            Go to Check-in Kiosk →
                        </Link>
                    </div>

                    {checkInQueue.length === 0 ? (
                        <p className="text-gray-400 text-center py-12">No appointments today</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left py-3 px-4 text-gray-700 font-semibold text-xs uppercase tracking-wide">Time</th>
                                        <th className="text-left py-3 px-4 text-gray-700 font-semibold text-xs uppercase tracking-wide">Patient</th>
                                        <th className="text-left py-3 px-4 text-gray-700 font-semibold text-xs uppercase tracking-wide">Dentist</th>
                                        <th className="text-left py-3 px-4 text-gray-700 font-semibold text-xs uppercase tracking-wide">Status</th>
                                        <th className="text-left py-3 px-4 text-gray-700 font-semibold text-xs uppercase tracking-wide">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkInQueue.slice(0, 5).map((apt) => (
                                        <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-gray-900 font-semibold">{apt.time}</td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-gray-900 font-medium">{apt.patient}</p>
                                                    <p className="text-gray-500 text-xs mt-0.5">{apt.type}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700">{apt.dentist}</td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                        apt.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : apt.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {apt.status === 'confirmed' && '✓ '}{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <button className="px-4 py-2 bg-[#0D9488] text-white text-xs font-semibold rounded hover:bg-[#0A7A70] transition-colors duration-200">
                                                    Check In
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Sidebar with Quick Actions and System Status */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href="/staff/patients/create"
                                className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg hover:border-[#0D9488] hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-[#0D9488] group-hover:text-white transition-all">
                                    <IconRegister />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Register Patient</p>
                                    <p className="text-gray-600 text-xs mt-0.5">Add a new patient profile</p>
                                </div>
                            </Link>

                            <Link
                                href="/staff/appointments/create"
                                className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg hover:border-[#0D9488] hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-[#0D9488] group-hover:text-white transition-all">
                                    <IconCalendar />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Book Appointment</p>
                                    <p className="text-gray-600 text-xs mt-0.5">Schedule a new visit</p>
                                </div>
                            </Link>

                            <Link
                                href="/staff/checkin"
                                className="flex items-start gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg hover:border-[#0D9488] hover:shadow-md transition-all group cursor-pointer"
                            >
                                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-[#0D9488] group-hover:text-white transition-all">
                                    <IconFootsteps />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Walk-in Check-in</p>
                                    <p className="text-gray-600 text-xs mt-0.5">Process arriving patients</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl p-6 shadow-sm text-white">
                        <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-teal-100">Database Connection</span>
                                <span className="font-semibold text-cyan-300">Online</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-teal-600 pt-3">
                                <span className="text-teal-100">SMS Gateway</span>
                                <span className="font-semibold text-cyan-300">Active</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-teal-600 pt-3">
                                <span className="text-teal-100">Last Backup</span>
                                <span className="font-semibold text-cyan-300">Today, 2:00 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <StaffLayout>{page}</StaffLayout>
