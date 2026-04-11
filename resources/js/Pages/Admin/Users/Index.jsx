import AdminLayout from '@/Layouts/AdminLayout'
import { Link, usePage, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'

export default function UsersIndex({ users, filters }) {
    const { url } = usePage()
    const [activeTab, setActiveTab] = useState(filters?.role || 'all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState(null)
    const [notification, setNotification] = useState(null)

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const getAvatarColor = (role) => {
        const colors = {
            admin: 'bg-blue-400',
            dentist: 'bg-purple-400',
            staff: 'bg-orange-400',
            patient: 'bg-green-400',
        }
        return colors[role] || colors.patient
    }

    const handleStatusChange = (userId, currentStatus, userName) => {
        router.put(`/admin/users/${userId}`, {
            active: !currentStatus,
        }, {
            onSuccess: () => {
                setNotification({
                    type: 'success',
                    message: `${userName} has been ${!currentStatus ? 'activated' : 'deactivated'} successfully.`
                })
                setTimeout(() => setNotification(null), 3000)
            },
            onError: (errors) => {
                setNotification({
                    type: 'error',
                    message: 'Failed to update user status. Please try again.'
                })
                setTimeout(() => setNotification(null), 3000)
            }
        })
    }

    const handleDelete = (userId, userName) => {
        if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            setIsDeleting(userId)
            router.delete(`/admin/users/${userId}`, {
                onSuccess: () => {
                    setNotification({
                        type: 'success',
                        message: `${userName} has been deleted successfully.`
                    })
                    setIsDeleting(null)
                    setTimeout(() => setNotification(null), 3000)
                },
                onError: (errors) => {
                    setIsDeleting(null)
                    setNotification({
                        type: 'error',
                        message: errors.message || 'Failed to delete user. Please try again.'
                    })
                    setTimeout(() => setNotification(null), 3000)
                }
            })
        }
    }

    const tabs = [
        { id: 'all', label: 'All Users' },
        { id: 'admin', label: 'Admins' },
        { id: 'dentist', label: 'Dentists' },
        { id: 'staff', label: 'Staff' },
        { id: 'patient', label: 'Patients' },
    ]

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        const role = tabId === 'all' ? 'all' : tabId
        router.get(`/admin/users?role=${role}`)
        setSearchQuery('')
    }

    // Filter users based on tab and search query
    const filteredUsers = useMemo(() => {
        let filtered = users.data || []

        // Filter by search query (since server already filtered by role)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [users.data, searchQuery])

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`px-4 py-3 rounded-lg flex items-center justify-between ${
                    notification.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                    <span>{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="text-current hover:opacity-70"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">User Management</h1>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-md"
                >
                    + Add User
                </Link>
            </div>

            {/* Tabs and Search */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    {/* Tabs */}
                    <div className="flex gap-8 mb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`pb-3 font-medium transition-colors relative ${
                                    activeTab === tab.id
                                        ? 'text-teal-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus-within:border-teal-500 focus-within:bg-white transition-all">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-0 focus:outline-none text-sm flex-1 placeholder-gray-400 text-gray-900"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Last Login</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Name with Avatar */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${getAvatarColor(user.role)} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                                    {getInitials(user.name)}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* Role Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : user.role === 'dentist'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : user.role === 'staff'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>

                                        {/* Last Login */}
                                        <td className="px-6 py-4 text-gray-600 text-sm">{user.last_login || 'Never'}</td>

                                        {/* Status Toggle */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(user.id, user.active, user.name)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        user.active ? 'bg-teal-500' : 'bg-gray-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            user.active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                                <span className={`text-xs font-medium ${
                                                    user.active ? 'text-teal-600' : 'text-gray-500'
                                                }`}>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 flex gap-3">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="text-gray-400 hover:text-teal-600 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
                                                disabled={isDeleting === user.id}
                                                className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0a7 7 0 10-9.9 0l4.35 4.35M11 19a6 6 0 100-12 6 6 0 000 12z" />
                                            </svg>
                                            <p className="text-gray-500 font-medium">No users found</p>
                                            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Showing <span className="font-medium">{filteredUsers.length}</span> {activeTab === 'all' ? 'users' : `${activeTab}s`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

UsersIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>
