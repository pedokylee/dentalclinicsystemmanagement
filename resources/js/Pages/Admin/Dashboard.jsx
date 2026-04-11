import AdminLayout from '@/Layouts/AdminLayout'
import StatCard from '@/Components/StatCard'
import { Link } from '@inertiajs/react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const IconUsers = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v-2a9 9 0 00-18 0v2z" />
    </svg>
)

const IconCalendar = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const IconStaff = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m4-16l4 4m0 0l4-4m-4 4v10a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4" />
    </svg>
)

const IconGear = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

export default function Dashboard({
    totalPatients = 0,
    todayAppointments = 0,
    activeStaff = 0,
    systemHealth = 0,
    appointmentsByDay = [0, 0, 0, 0, 0, 0],
    days = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'],
    patientsByMonth = [0, 0, 0, 0, 0, 0, 0, 0],
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    recentAppointments = [],
}) {
    const appointmentsData = {
        labels: days,
        datasets: [
            {
                label: 'Appointments',
                data: appointmentsByDay,
                borderColor: '#0D9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#0D9488',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    }

    const patientsData = {
        labels: months,
        datasets: [
            {
                label: 'New Patients',
                data: patientsByMonth,
                backgroundColor: '#0D9488',
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    }

    return (
        <div className="space-y-8">
            {/* Header with Action Buttons */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
                <div className="flex gap-4">
                    <Link
                        href="/admin/users/create"
                        className="px-6 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors duration-200 flex items-center gap-2"
                    >
                        + New Patient
                    </Link>
                    <Link
                        href="/admin/appointments/create"
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors duration-200 flex items-center gap-2 shadow-md"
                    >
                        <IconCalendar /> Book Appointment
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Patients"
                    value={totalPatients}
                    change={12}
                    icon={<IconUsers />}
                />
                <StatCard
                    label="Today's Appointments"
                    value={todayAppointments}
                    change={5}
                    icon={<IconCalendar />}
                />
                <StatCard
                    label="Active Staff"
                    value={activeStaff}
                    change={0}
                    icon={<IconStaff />}
                />
                <StatCard
                    label="System Health"
                    value={`${systemHealth}%`}
                    change={0}
                    icon={<IconGear />}
                />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-80">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Appointments (Last 6 Months)</h3>
                    <div className="relative h-64 w-full">
                        <Line data={appointmentsData} options={chartOptions} />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow h-80">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Growth (Last 6 Months)</h3>
                    <div className="relative h-64 w-full">
                        <Bar data={patientsData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Appointments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Dentist</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 text-gray-900 font-medium">{apt.patient}</td>
                                    <td className="px-6 py-3 text-gray-600">{apt.dentist}</td>
                                    <td className="px-6 py-3 text-gray-600">{apt.date} {apt.time}</td>
                                    <td className="px-6 py-3 text-gray-600">{apt.type}</td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                apt.status === 'confirmed'
                                                    ? 'bg-teal-100 text-teal-700'
                                                    : apt.status === 'pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>