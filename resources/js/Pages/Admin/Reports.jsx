import AdminLayout from '@/Layouts/AdminLayout'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import StatCard from '@/Components/StatCard'
import { router } from '@inertiajs/react'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Reports({ appointmentsByDay, dayLabels, patientGrowth, monthLabels, procedures, procedureData, monthlySummary }) {
    const appointmentsChartData = {
        labels: dayLabels,
        datasets: [{ label: 'Appointments', data: appointmentsByDay, backgroundColor: '#0D9488' }],
    }

    const patientGrowthChartData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'New Patients',
                data: patientGrowth,
                backgroundColor: 'rgba(13, 148, 136, 0.5)',
                borderColor: '#0D9488',
            },
        ],
    }

    const procedureChartData = {
        labels: procedures,
        datasets: [
            {
                data: procedureData,
                backgroundColor: ['#0D9488', '#14B8A6', '#2DD4BF', '#99F6E4', '#F59E0B'],
            },
        ],
    }

    const handleExportPdf = () => {
        window.location.href = route('admin.reports.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('admin.reports.export-excel')
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#E2FAF7]">Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Appointments" value={monthlySummary.appointments} />
                <StatCard label="Total Patients" value={monthlySummary.patients} />
                <StatCard label="Monthly Revenue" value={`$${monthlySummary.revenue}`} color="gold" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#0D9488] mb-4">Appointments by Day</h3>
                    <Bar data={appointmentsChartData} />
                </div>
                <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#0D9488] mb-4">Patient Growth</h3>
                    <Bar data={patientGrowthChartData} />
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] p-6 rounded-lg md:w-1/2">
                <h3 className="text-lg font-bold text-[#0D9488] mb-4">Procedure Breakdown</h3>
                <Doughnut data={procedureChartData} />
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleExportPdf}
                    className="px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors"
                >
                    Export PDF
                </button>
                <button 
                    onClick={handleExportExcel}
                    className="px-6 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 transition-colors"
                >
                    Export Excel
                </button>
            </div>
        </div>
    )
}

Reports.layout = (page) => <AdminLayout>{page}</AdminLayout>
