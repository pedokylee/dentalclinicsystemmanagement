import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'

const IconArchive = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
)

const IconDownload = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
)

const IconRestore = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
)

const IconTrash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

function Backup({ backups: initialBackups }) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [restoring, setRestoring] = useState(null)
    const [backups, setBackups] = useState(initialBackups || [])
    const [notification, setNotification] = useState(null)
    const { props } = usePage()

    useEffect(() => {
        if (props.backups) {
            setBackups(props.backups)
        }
    }, [props.backups])

    const handleCreateBackup = () => {
        setLoading(true)
        router.post('/admin/backup', {}, {
            onSuccess: (page) => {
                if (page.props.backups) {
                    setBackups(page.props.backups)
                }
                setNotification({ type: 'success', message: 'Backup created successfully!' })
                setTimeout(() => setNotification(null), 3000)
                setLoading(false)
            },
            onError: (errors) => {
                console.error('Backup error:', errors)
                setNotification({ type: 'error', message: 'Failed to create backup' })
                setTimeout(() => setNotification(null), 3000)
                setLoading(false)
            },
            onFinish: () => {
                setLoading(false)
            }
        })
    }

    const handleDownload = (backupName) => {
        try {
            window.location.href = `/admin/backup/${backupName}`
        } catch (error) {
            console.error('Download failed:', error)
            setNotification({ type: 'error', message: 'Download failed' })
            setTimeout(() => setNotification(null), 3000)
        }
    }

    const handleRestore = (backupName) => {
        if (!confirm('Are you sure you want to restore this backup? This will overwrite your current data.')) {
            return
        }
        
        setRestoring(backupName)
        router.post(`/admin/backup/${backupName}/restore`, {}, {
            onSuccess: (page) => {
                if (page.props.backups) {
                    setBackups(page.props.backups)
                }
                setNotification({ type: 'success', message: 'Backup restored successfully!' })
                setTimeout(() => setNotification(null), 3000)
                setRestoring(null)
            },
            onError: (errors) => {
                console.error('Restore error:', errors)
                setNotification({ type: 'error', message: 'Failed to restore backup' })
                setTimeout(() => setNotification(null), 3000)
                setRestoring(null)
            }
        })
    }

    const handleDelete = (backupName) => {
        if (!confirm('Are you sure you want to delete this backup?')) {
            return
        }
        
        setDeleting(backupName)
        router.delete(`/admin/backup/${backupName}`, {
            onSuccess: (page) => {
                if (page.props.backups) {
                    setBackups(page.props.backups)
                }
                setNotification({ type: 'success', message: 'Backup deleted successfully!' })
                setTimeout(() => setNotification(null), 3000)
                setDeleting(null)
            },
            onError: (errors) => {
                console.error('Delete error:', errors)
                setNotification({ type: 'error', message: 'Failed to delete backup' })
                setTimeout(() => setNotification(null), 3000)
                setDeleting(null)
            }
        })
    }

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Backup & Restore</h1>
                <p className="text-gray-600">Database Backup Management</p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    <div className="flex justify-between items-center">
                        <span>{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="text-lg">×</button>
                    </div>
                </div>
            )}

            {/* System Data Backup Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                            <IconArchive />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">System Data Backup</h2>
                            <p className="text-gray-600 mt-1">Create automatic backups of your database and files</p>
                        </div>
                    </div>
                    <button onClick={handleCreateBackup} disabled={loading} className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h-6" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create Backup Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Backup History Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-bold text-gray-900">Backup History</h3>
                    <p className="text-sm text-gray-600 mt-1">Retaining last 30 days of backups</p>
                </div>

                {backups && backups.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Filename</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Created</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Size</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {backups.map((backup, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{backup.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(backup.date)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${backup.type === 'Automated' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {backup.type || 'Manual'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatBytes(backup.size)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 flex items-center gap-1 w-fit">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Success
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3">
                                                <button onClick={() => handleDownload(backup.name)} title="Download" className="text-teal-600 hover:text-teal-800 transition-colors">
                                                    <IconDownload />
                                                </button>
                                                <button onClick={() => handleRestore(backup.name)} disabled={restoring === backup.name} title="Restore" className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50">
                                                    <IconRestore />
                                                </button>
                                                <button onClick={() => handleDelete(backup.name)} disabled={deleting === backup.name} title="Delete" className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50">
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No backups found. Create one using the button above.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Backup

Backup.layout = (page) => <AdminLayout>{page}</AdminLayout>
