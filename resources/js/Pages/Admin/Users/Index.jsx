import AdminLayout from '@/Layouts/AdminLayout'
import { Link } from '@inertiajs/react'

export default function UsersIndex({ users }) {
    const handleExportPdf = () => {
        window.location.href = route('admin.users.export-pdf')
    }

    const handleExportExcel = () => {
        window.location.href = route('admin.users.export-excel')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">User Management</h1>
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
                    <Link
                        href="/admin/users/create"
                        className="px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors"
                    >
                        Add User
                    </Link>
                </div>
            </div>

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Name</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Email</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Role</th>
                            <th className="px-6 py-3 text-left text-[#0D9488]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724] text-[#E2FAF7]">
                                <td className="px-6 py-3">{user.name}</td>
                                <td className="px-6 py-3">{user.email}</td>
                                <td className="px-6 py-3">
                                    <span className="px-3 py-1 bg-[#0D9488] text-white rounded text-xs">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-3 space-x-2">
                                    <Link href={`/admin/users/${user.id}/edit`} className="text-[#0D9488] hover:text-[#14B8A6]">
                                        Edit
                                    </Link>
                                    <button className="text-red-500 hover:text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

UsersIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
