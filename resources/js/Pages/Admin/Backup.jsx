import AdminLayout from '@/Layouts/AdminLayout'
import { router } from '@inertiajs/react'
import { Database, Download, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Backup({ backups }) {
    const [creating, setCreating] = useState(false)
    const [workingFile, setWorkingFile] = useState(null)

    const createBackup = () => {
        setCreating(true)
        router.post('/admin/backup', {}, { onFinish: () => setCreating(false) })
    }

    const restoreBackup = (name) => {
        if (!confirm('Restore this backup and overwrite the current database?')) {
            return
        }

        setWorkingFile(name)
        router.post(`/admin/backup/${name}/restore`, {}, { onFinish: () => setWorkingFile(null) })
    }

    const deleteBackup = (name) => {
        if (!confirm('Delete this backup file?')) {
            return
        }

        setWorkingFile(name)
        router.delete(`/admin/backup/${name}`, { onFinish: () => setWorkingFile(null) })
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Backup & Restore</h1>
                    <p className="dcms-page-subtitle">Create database snapshots, download previous backups, and restore clinic data when needed.</p>
                </div>
                <button className="dcms-btn-gold" onClick={createBackup} disabled={creating}>
                    <Database className="h-4 w-4" />
                    {creating ? 'Creating Backup...' : 'Create Backup'}
                </button>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="dcms-icon-badge">
                            <Database className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl">Available Backups</h2>
                            <p className="text-sm text-[var(--dcms-text-soft)]">Stored on the local server for download and restore operations.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="dcms-table">
                            <thead>
                                <tr>
                                    <th>Filename</th>
                                    <th>Date</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.length > 0 ? backups.map((backup) => (
                                    <tr key={backup.name}>
                                        <td className="font-semibold">{backup.name}</td>
                                        <td>{backup.date}</td>
                                        <td>{Math.round((backup.size / 1024) * 100) / 100} KB</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <a className="dcms-btn-secondary !px-3 !py-2" href={`/admin/backup/${backup.name}`}>
                                                    <Download className="h-4 w-4" />
                                                </a>
                                                <button className="dcms-btn-primary !px-3 !py-2" onClick={() => restoreBackup(backup.name)} disabled={workingFile === backup.name}>
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                                <button className="dcms-btn-secondary !border-red-200 !text-red-600 !px-3 !py-2 hover:!bg-red-50" onClick={() => deleteBackup(backup.name)} disabled={workingFile === backup.name}>
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-10 text-center text-[var(--dcms-text-soft)]">No backups available yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

Backup.layout = (page) => <AdminLayout>{page}</AdminLayout>
