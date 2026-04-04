import AdminLayout from '@/Layouts/AdminLayout'
import { Link } from '@inertiajs/react'

export default function AuditLog({ logs }) {
    const handleExportPdf = () => {
        window.location.href = route('admin.audit-log.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('admin.audit-log.export-excel')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">Audit Log</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportPdf}
                        className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors text-sm"
                    >
                        Export PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-[#F59E0B] text-white rounded hover:bg-opacity-80 transition-colors text-sm"
                    >
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg overflow-hidden">
                <table className="w-full text-sm text-[#E2FAF7]">
                    <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-[#0D9488]">User</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Action</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Module</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Description</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.data.map((log) => (
                            <tr key={log.id} className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724]">
                                <td className="px-6 py-3">{log.user?.name || 'System'}</td>
                                <td className="px-6 py-3">
                                    <span className="px-3 py-1 bg-[#0D9488] text-white rounded-full text-xs">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-3">{log.module}</td>
                                <td className="px-6 py-3 text-[#7ABFB9]">{log.description}</td>
                                <td className="px-6 py-3 text-[#7ABFB9]">{new Date(log.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

AuditLog.layout = (page) => <AdminLayout>{page}</AdminLayout>
