import StaffLayout from '@/Layouts/StaffLayout'
import { Link, usePage } from '@inertiajs/react'
import { BellIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

export default function AppointmentsIndex({ appointments }) {
    const [filters, setFilters] = useState({
        search: '',
        dentist: 'all',
        date: '',
        status: 'all',
    })

    const handleExportPdf = () => {
        window.location.href = route('staff.appointments.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('staff.appointments.export-excel')
    }

    const getStatusBadgeColor = (status) => {
        const colors = {
            confirmed: 'bg-teal-100 text-teal-700 border border-teal-200',
            pending: 'bg-amber-100 text-amber-700 border border-amber-200',
            cancelled: 'bg-red-100 text-red-700 border border-red-200',
            rescheduled: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        }
        return colors[status] || colors.pending
    }

    const getStatusLabel = (status) => {
        const labels = {
            confirmed: 'Confirmed',
            pending: 'Pending',
            cancelled: 'Cancelled',
            rescheduled: 'Rescheduled',
        }
        return labels[status] || status
    }

    return (
        <StaffLayout>
            <div className="max-w-7xl mx-auto py-8">
                {/* Header with Export Buttons */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
                        <p className="text-gray-600">View, filter, and manage all clinic appointments</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportPdf}
                            className="px-4 py-2.5 bg-white border-2 border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                            title="Export as PDF"
                        >
                            📄 PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2.5 bg-white border-2 border-green-200 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                            title="Export as Excel"
                        >
                            📊 Excel
                        </button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-5 gap-4 items-end">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search patient or ID..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                            />
                        </div>

                        {/* Dentist Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dentist
                            </label>
                            <select
                                value={filters.dentist}
                                onChange={(e) => setFilters({ ...filters, dentist: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                            >
                                <option value="all">All Dentists</option>
                                <option value="dr-sarah">Dr. Sarah Jenkins</option>
                                <option value="dr-mark">Dr. Mark Taylor</option>
                                <option value="dr-emily">Dr. Emily Chen</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                                placeholder="mm/dd/yyyy"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                            >
                                <option value="all">All Statuses</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rescheduled">Rescheduled</option>
                            </select>
                        </div>

                        {/* Filter Button */}
                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#0D9488] transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 5.707A1 1 0 013 5V3z" />
                                </svg>
                                Filter
                            </button>
                            <Link
                                href="/staff/appointments/create"
                                className="px-6 py-2.5 bg-[#0D9488] hover:bg-[#0A7A70] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                            >
                                + Book New
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Dentist</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {appointments.data.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">APT-{String(apt.id).padStart(4, '0')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{apt.patient.full_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">Dr. {apt.dentist.user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div>{apt.appointment_date}</div>
                                            <div className="text-xs text-gray-500">{apt.appointment_time}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{apt.type || 'Checkup'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(apt.status)}`}>
                                                {getStatusLabel(apt.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    title="Send notification"
                                                    className="text-amber-500 hover:text-amber-600 transition-colors"
                                                >
                                                    <BellIcon className="w-5 h-5" />
                                                </button>
                                                <Link
                                                    href={`/staff/appointments/${apt.id}/edit`}
                                                    className="text-[#0D9488] hover:text-[#0A7A70] transition-colors"
                                                    title="Edit appointment"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    title="Delete appointment"
                                                    className="text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing 1 to {Math.min(8, appointments.data.length)} of {appointments.total} results
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">&larr;</button>
                            <button className="px-3 py-1 text-sm bg-[#0D9488] text-white rounded font-medium">1</button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">2</button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">3</button>
                            <span className="px-2 text-gray-400">...</span>
                            <button className="px-3 py-1 text-sm text-gray-500">&rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    )
}
