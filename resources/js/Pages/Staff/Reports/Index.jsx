import StaffLayout from '@/Layouts/StaffLayout'
import StatCard from '@/Components/StatCard'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { CalendarDays, ClipboardList, Users } from 'lucide-react'
import { router } from '@inertiajs/react'
import { useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function StaffReports({ appointmentsByDay, dayLabels, monthlySummary, filters }) {
    const [startDate, setStartDate] = useState(filters?.startDate ?? '')
    const [endDate, setEndDate] = useState(filters?.endDate ?? '')

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Basic Reports</h1>
                    <p className="dcms-page-subtitle">Read-only appointment and patient activity snapshots for front desk operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="date" className="dcms-input max-w-[180px]" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                    <input type="date" className="dcms-input max-w-[180px]" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                    <button
                        className="dcms-btn-primary"
                        onClick={() =>
                            router.get('/staff/reports', { startDate, endDate }, {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                                only: ['appointmentsByDay', 'dayLabels', 'monthlySummary', 'filters'],
                            })
                        }
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Appointments" value={monthlySummary?.appointments ?? 0} icon={<CalendarDays className="h-5 w-5" />} />
                <StatCard label="New Patients" value={monthlySummary?.patients ?? 0} icon={<Users className="h-5 w-5" />} />
                <StatCard label="Procedures Logged" value={monthlySummary?.procedures ?? 0} icon={<ClipboardList className="h-5 w-5" />} />
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <h2 className="mb-5 text-xl">Appointments by Day</h2>
                    <div className="h-[320px]">
                        <Bar
                            data={{
                                labels: dayLabels,
                                datasets: [
                                    {
                                        label: 'Appointments',
                                        data: appointmentsByDay,
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
        </div>
    )
}

StaffReports.layout = (page) => <StaffLayout>{page}</StaffLayout>
