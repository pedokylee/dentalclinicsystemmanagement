import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useMemo } from 'react'

export default function AuditLog({ logs = { data: [] } }) {
    const [filters, setFilters] = useState({ user: '', module: '', startDate: '', endDate: '' })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredLogs = useMemo(() => {
        return logs.data.filter(log => {
            const matchesUser = log.user?.name?.toLowerCase().includes(filters.user.toLowerCase()) || filters.user === ''
            const matchesModule = log.module?.toLowerCase().includes(filters.module.toLowerCase()) || filters.module === ''
            const logDate = new Date(log.created_at)
            const matchesStartDate = !filters.startDate || logDate >= new Date(filters.startDate)
            const matchesEndDate = !filters.endDate || logDate <= new Date(filters.endDate)
            return matchesUser && matchesModule && matchesStartDate && matchesEndDate
        })
    }, [logs.data, filters])

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredLogs.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredLogs, currentPage])

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

    const handleReset = () => {
        setFilters({ user: '', module: '', startDate: '', endDate: '' })
        setCurrentPage(1)
    }

    const getActionColor = (action) => {
        const lowerAction = action.toLowerCase()
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'text-red-600 bg-red-50'
        if (lowerAction.includes('create') || lowerAction.includes('add')) return 'text-teal-600 bg-teal-50'
        if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'text-blue-600 bg-blue-50'
        return 'text-gray-600 bg-gray-50'
    }

    const getModuleBadge = (module) => {
        const moduleColors = {
            'Users': 'bg-blue-100 text-blue-800',
            'Reports': 'bg-purple-100 text-purple-800',
            'Backup': 'bg-orange-100 text-orange-800',
            'Config': 'bg-indigo-100 text-indigo-800',
            'default': 'bg-gray-100 text-gray-800'
        }
        const color = moduleColors[module] || moduleColors.default
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{module}</span>
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-gray-600">Track all system activities and changes</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">User</label>
                        <input type="text" placeholder="Filter by user name" value={filters.user} onChange={(e) => { setFilters({...filters, user: e.target.value}); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Module</label>
                        <input type="text" placeholder="Filter by module" value={filters.module} onChange={(e) => { setFilters({...filters, module: e.target.value}); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                        <input type="date" value={filters.startDate} onChange={(e) => { setFilters({...filters, startDate: e.target.value}); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                        <input type="date" value={filters.endDate} onChange={(e) => { setFilters({...filters, endDate: e.target.value}); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleReset} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm">
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {filteredLogs.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Module</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-teal-600 font-medium">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user?.name || 'System'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{getModuleBadge(log.module)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{log.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="font-semibold">{filteredLogs.length}</span> results
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ← Previous
                                </button>
                                {Array.from({length: totalPages}).map((_, idx) => {
                                    const page = idx + 1
                                    if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-teal-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                                                {page}
                                            </button>
                                        )
                                    } else if (idx === 1 || idx === totalPages - 2) {
                                        return <span key={`ellipsis-${idx}`} className="px-2 py-2">...</span>
                                    }
                                    return null
                                })}
                                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No audit logs found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

AuditLog.layout = (page) => <AdminLayout>{page}</AdminLayout>
