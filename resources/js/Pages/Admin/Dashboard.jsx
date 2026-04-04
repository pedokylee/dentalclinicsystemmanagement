import AdminLayout from '@/Layouts/AdminLayout'
import StatCard from '@/Components/StatCard'
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
    Legend
)

export default function Dashboard({
    totalPatients,
    todayAppointments,
    activeStaff,
    systemHealth,
    appointmentsByDay,
    days,
    patientsByMonth,
    months,
    recentAppointments,
}) {
    const appointmentsData = {
        labels: days,
        datasets: [
            {
                label: 'Appointments',
                data: appointmentsByDay,
                backgroundColor: '#0D9488',
                borderColor: '#0D9488',
                borderWidth: 1,
            },
        ],
    }

    const patientsData = {
        labels: months,
        datasets: [
            {
                label: 'New Patients',
                data: patientsByMonth,
                borderColor: '#0D9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                tension: 0.4,
            },
        ],
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Patients" value={totalPatients} icon="👥" />
                <StatCard label="Today's Appointments" value={todayAppointments} icon="📅" />
                <StatCard label="Active Staff" value={activeStaff} icon="👔" />
                <StatCard label="System Health" value={`${systemHealth}%`} color="gold" icon="⚙️" />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#0D9488] mb-4">Appointments This Week</h3>
                    <Bar data={appointmentsData} />
                </div>
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#0D9488] mb-4">Patient Growth</h3>
                    <Line data={patientsData} />
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#0D9488] mb-4">Recent Appointments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#E2FAF7]">
                        <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                            <tr>
                                <th className="px-4 py-2 text-left text-[#0D9488]">Patient</th>
                                <th className="px-4 py-2 text-left text-[#0D9488]">Dentist</th>
                                <th className="px-4 py-2 text-left text-[#0D9488]">Date & Time</th>
                                <th className="px-4 py-2 text-left text-[#0D9488]">Type</th>
                                <th className="px-4 py-2 text-left text-[#0D9488]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724]">
                                    <td className="px-4 py-2">{apt.patient}</td>
                                    <td className="px-4 py-2">{apt.dentist}</td>
                                    <td className="px-4 py-2">{apt.date} {apt.time}</td>
                                    <td className="px-4 py-2">{apt.type}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                apt.status === 'confirmed'
                                                    ? 'bg-[#0D9488] text-white'
                                                    : apt.status === 'pending'
                                                    ? 'bg-[#F59E0B] text-white'
                                                    : 'bg-red-600 text-white'
                                            }`}
                                        >
                                            {apt.status}
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