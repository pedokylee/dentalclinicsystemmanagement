import AdminLayout from '@/Layouts/AdminLayout'
import StatCard from '@/Components/StatCard'
import { router } from '@inertiajs/react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { CalendarDays, ClipboardList, Coins, Users } from 'lucide-react'
import { useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Reports({
    appointmentsByDay,
    dayLabels,
    patientGrowth,
    monthLabels,
    procedures,
    procedureData,
    monthlySummary,
    dailySummary,
    appointmentsTable,
    filters,
}) {
    const [startDate, setStartDate] = useState(filters?.startDate ?? '')
    const [endDate, setEndDate] = useState(filters?.endDate ?? '')

    const refresh = () => {
        router.get('/admin/reports', { startDate, endDate }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['appointmentsByDay', 'dayLabels', 'patientGrowth', 'monthLabels', 'procedures', 'procedureData', 'monthlySummary', 'dailySummary', 'appointmentsTable', 'filters'],
        })
    }

    const query = new URLSearchParams({ startDate, endDate }).toString()

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Analytics & Reports</h1>
                    <p className="dcms-page-subtitle">Track clinic performance, treatment volume, and patient growth over the selected period.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <input type="date" className="dcms-input max-w-[180px]" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                    <input type="date" className="dcms-input max-w-[180px]" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                    <button className="dcms-btn-primary" onClick={refresh}>Apply Range</button>
                    <a className="dcms-btn-gold" href={`/admin/reports/export-pdf?${query}`}>Export PDF</a>
                    <a className="dcms-btn-secondary" href={`/admin/reports/export-excel?${query}`}>Export Excel</a>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Appointments" value={monthlySummary?.appointments ?? 0} icon={<CalendarDays className="h-5 w-5" />} />
                <StatCard label="New Patients" value={monthlySummary?.patients ?? 0} icon={<Users className="h-5 w-5" />} />
                <StatCard label="Procedures" value={monthlySummary?.procedures ?? 0} icon={<ClipboardList className="h-5 w-5" />} />
                <StatCard label="Estimated Revenue" value={`PHP ${Number(monthlySummary?.revenue ?? 0).toLocaleString()}`} icon={<Coins className="h-5 w-5" />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <section className="dcms-card xl:col-span-2">
                    <div className="dcms-card-body">
                        <h2 className="mb-5 text-xl">Appointments by Day</h2>
                        <div className="h-[320px]">
                            <Line
                                data={{
                                    labels: dayLabels,
                                    datasets: [
                                        {
                                            label: 'Appointments',
                                            data: appointmentsByDay,
                                            borderColor: '#0D9488',
                                            backgroundColor: 'rgba(13,148,136,0.14)',
                                            fill: true,
                                            tension: 0.35,
                                        },
                                    ],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                            />
                        </div>
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <h2 className="mb-5 text-xl">Procedure Breakdown</h2>
                        <div className="h-[320px]">
                            <Doughnut
                                data={{
                                    labels: procedures,
                                    datasets: [
                                        {
                                            data: procedureData,
                                            backgroundColor: ['#0D9488', '#14B8A6', '#2DD4BF', '#99F6E4', '#F59E0B', '#0B5E57'],
                                        },
                                    ],
                                }}
                                options={{ responsive: true, maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <h2 className="mb-5 text-xl">Patient Growth</h2>
                    <div className="h-[280px]">
                        <Bar
                            data={{
                                labels: monthLabels,
                                datasets: [
                                    {
                                        label: 'New Patients',
                                        data: patientGrowth,
                                        backgroundColor: '#14B8A6',
                                        borderRadius: 8,
                                    },
                                ],
                            }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                        />
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <h2 className="mb-4 text-xl">Summary by Day</h2>
                        <div className="overflow-x-auto">
                            <table className="dcms-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Completed</th>
                                        <th>Cancelled</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dailySummary.map((day) => (
                                        <tr key={day.date}>
                                            <td>{day.date}</td>
                                            <td>{day.total}</td>
                                            <td>{day.completed}</td>
                                            <td>{day.cancelled}</td>
                                            <td>PHP {Number(day.revenue).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section className="dcms-card">
                    <div className="dcms-card-body">
                        <h2 className="mb-4 text-xl">Appointment Register</h2>
                        <div className="overflow-x-auto">
                            <table className="dcms-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient</th>
                                        <th>Dentist</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointmentsTable.slice(0, 10).map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.patient}</td>
                                            <td>{appointment.dentist}</td>
                                            <td>{appointment.type}</td>
                                            <td>
                                                <span className={appointment.status === 'confirmed' ? 'dcms-chip-teal' : appointment.status === 'cancelled' ? 'dcms-chip-red' : 'dcms-chip-gold'}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

Reports.layout = (page) => <AdminLayout>{page}</AdminLayout>
