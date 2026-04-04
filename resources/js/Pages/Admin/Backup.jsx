import AdminLayout from '@/Layouts/AdminLayout'
import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'

export default function Backup({ backups: initialBackups }) {
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [backups, setBackups] = useState(initialBackups || [])
    const { props } = usePage()

    // Update backups when page props change
    useEffect(() => {
        if (props.backups) {
            setBackups(props.backups)
        }
    }, [props.backups])

    const handleCreateBackup = () => {
        setLoading(true)
        router.post('/admin/backup', {}, {
            onSuccess: (page) => {
                // Update backups list from the response
                if (page.props.backups) {
                    setBackups(page.props.backups)
                }
                setLoading(false)
            },
            onError: (errors) => {
                console.error('Backup error:', errors)
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
        }
    }

    const handleDelete = (backupName) => {
        if (!confirm('Are you sure you want to delete this backup?')) {
            return
        }
        
        setDeleting(backupName)
        router.delete(`/admin/backup/${backupName}`, {
            onSuccess: (page) => {
                // Update backups list from the response
                if (page.props.backups) {
                    setBackups(page.props.backups)
                }
                setDeleting(null)
            },
            onError: (errors) => {
                console.error('Delete error:', errors)
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#E2FAF7]">Database Backups</h1>
                <button
                    onClick={handleCreateBackup}
                    disabled={loading}
                    className="px-6 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Backup'}
                </button>
            </div>

            {props.flash?.success && (
                <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
                    {props.flash.success}
                </div>
            )}

            {props.flash?.error && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                    {props.flash.error}
                </div>
            )}

            <div className="bg-[#0E2C28] border border-[rgba(45,212,191,0.12)] rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#0D9488] mb-4">Available Backups</h2>

                {backups && backups.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-[#E2FAF7]">
                            <thead className="bg-[#0F2724] border-b border-[rgba(45,212,191,0.12)]">
                                <tr>
                                    <th className="px-4 py-2 text-left text-[#0D9488]">Filename</th>
                                    <th className="px-4 py-2 text-left text-[#0D9488]">Size</th>
                                    <th className="px-4 py-2 text-left text-[#0D9488]">Created</th>
                                    <th className="px-4 py-2 text-left text-[#0D9488]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.map((backup, idx) => (
                                    <tr key={idx} className="border-b border-[rgba(45,212,191,0.06)] hover:bg-[#0F2724]">
                                        <td className="px-4 py-2">{backup.name}</td>
                                        <td className="px-4 py-2">{formatBytes(backup.size)}</td>
                                        <td className="px-4 py-2">{backup.date}</td>
                                        <td className="px-4 py-2">
                                            <button 
                                                onClick={() => handleDownload(backup.name)}
                                                className="text-[#0D9488] hover:text-[#14B8A6] mr-3"
                                            >
                                                Download
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(backup.name)}
                                                disabled={deleting === backup.name}
                                                className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                            >
                                                {deleting === backup.name ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-[#7ABFB9]">No backups found. Create one using the button above.</p>
                )}
            </div>
        </div>
    )
}

Backup.layout = (page) => <AdminLayout>{page}</AdminLayout>
