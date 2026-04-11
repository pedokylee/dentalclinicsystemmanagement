import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import StatCard from '@/Components/StatCard'
import { router } from '@inertiajs/react'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

const IconCalendar = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const IconUsers = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v-2a9 9 0 00-18 0v2z" />
    </svg>
)

const IconClipboard = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const IconCurrency = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export default function Reports({ appointmentsByDay, dayLabels, patientGrowth, monthLabels, procedures, procedureData, monthlySummary, dailySummary }) {
    const [fromDate, setFromDate] = useState('10/01/2023')
    const [toDate, setToDate] = useState('10/31/2023')

    const appointmentsChartData = {
        labels: dayLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Appointments',
                data: appointmentsByDay || [40, 50, 40, 65, 55, 30, 10],
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

    const patientGrowthChartData = {
        labels: monthLabels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'New',
                data: [10, 20, 15, 25],
                backgroundColor: '#2DD4BF',
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Returning',
                data: [45, 50, 50, 50],
                backgroundColor: '#0D9488',
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    }

    const procedureChartData = {
        labels: procedures || ['Checkup', 'Cleaning', 'Filling', 'Root Canal', 'Extraction'],
        datasets: [
            {
                data: procedureData || [30, 25, 20, 15, 10],
                backgroundColor: ['#2DD4BF', '#0D9488', '#14B8A6', '#99F6E4', '#F59E0B'],
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
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

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
        },
    }

    const handleGenerateReport = () => {
        console.log('Generate report:', { fromDate, toDate })
    }

    const handleExportPdf = () => {
        window.location.href = route('admin.reports.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('admin.reports.export-excel')
    }

    return (
        <div className="space-y-8">
            {/* Header with Date Range */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-gray-600">to</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-md"
                    >
                        Generate
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Appointments"
                    value={monthlySummary?.appointments || 342}
                    icon={<IconCalendar />}
                />
                <StatCard
                    label="New Patients"
                    value={monthlySummary?.patients || 89}
                    icon={<IconUsers />}
                />
                <StatCard
                    label="Procedures Done"
                    value={monthlySummary?.procedures || 267}
                    icon={<IconClipboard />}
                />
                <StatCard
                    label="Total Revenue"
                    value={`$${monthlySummary?.revenue || 45230}`}
                    icon={<IconCurrency />}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointments by Day */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Appointments by Day</h3>
                    <Line data={appointmentsChartData} options={chartOptions} />
                </div>

                {/* Patient Growth */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Growth</h3>
                    <Bar data={patientGrowthChartData} options={chartOptions} />
                </div>
            </div>

            {/* Procedure Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Procedure Breakdown</h3>
                <div className="flex justify-center max-w-md mx-auto">
                    <Doughnut data={procedureChartData} options={doughnutOptions} />
                </div>
            </div>

            {/* Daily Summary Report */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Daily Summary Report</h3>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportPdf}
                            className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="px-6 py-2 border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Total Appointments</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Completed</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Cancelled</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Est. Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailySummary && dailySummary.length > 0 ? (
                                dailySummary.map((day, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">{day.date}</td>
                                        <td className="px-6 py-4 text-gray-600">{day.total}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-600 font-medium">{day.completed}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-red-600 font-medium">{day.cancelled}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-amber-600 font-medium">${day.revenue}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Sample data if none provided
                                [
                                    { date: '2023-10-24', total: 45, completed: 40, cancelled: 5, revenue: 4500 },
                                    { date: '2023-10-23', total: 52, completed: 48, cancelled: 4, revenue: 5200 },
                                    { date: '2023-10-22', total: 38, completed: 35, cancelled: 3, revenue: 3800 },
                                    { date: '2023-10-21', total: 65, completed: 60, cancelled: 5, revenue: 6500 },
                                    { date: '2023-10-20', total: 48, completed: 45, cancelled: 3, revenue: 4800 },
                                ].map((day, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 font-medium">{day.date}</td>
                                        <td className="px-6 py-4 text-gray-600">{day.total}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-600 font-medium">{day.completed}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-red-600 font-medium">{day.cancelled}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-amber-600 font-medium">${day.revenue}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

Reports.layout = (page) => <AdminLayout>{page}</AdminLayout>
