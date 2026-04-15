import AdminLayout from '@/Layouts/AdminLayout'
import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function AuditLog({ logs, filters }) {
    const [form, setForm] = useState({
        user: filters?.user ?? '',
        module: filters?.module ?? '',
        startDate: filters?.startDate ?? '',
        endDate: filters?.endDate ?? '',
    })

    const applyFilters = () => {
        router.get('/admin/audit-log', form, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['logs', 'filters'],
        })
    }

    return (
        <div className="dcms-page">
            <div>
                <h1 className="dcms-page-title">Audit Log</h1>
                <p className="dcms-page-subtitle">Track user activity, module access, exports, and operational changes across the clinic.</p>
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="dcms-label">User</label>
                            <input className="dcms-input" value={form.user} onChange={(event) => setForm({ ...form, user: event.target.value })} placeholder="Search user" />
                        </div>
                        <div>
                            <label className="dcms-label">Module</label>
                            <input className="dcms-input" value={form.module} onChange={(event) => setForm({ ...form, module: event.target.value })} placeholder="appointments, backups..." />
                        </div>
                        <div>
                            <label className="dcms-label">Start Date</label>
                            <input type="date" className="dcms-input" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
                        </div>
                        <div>
                            <label className="dcms-label">End Date</label>
                            <input type="date" className="dcms-input" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button className="dcms-btn-primary" onClick={applyFilters}>Apply Filters</button>
                        <button
                            className="dcms-btn-secondary"
                            onClick={() => {
                                setForm({ user: '', module: '', startDate: '', endDate: '' })
                                router.get('/admin/audit-log', {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                    only: ['logs', 'filters'],
                                })
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </section>

            <section className="dcms-card">
                <div className="overflow-x-auto">
                    <table className="dcms-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Module</th>
                                <th>Description</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.created_at).toLocaleString()}</td>
                                    <td>{log.user?.name ?? 'System'}</td>
                                    <td>
                                        <span className="dcms-chip-slate">{log.action}</span>
                                    </td>
                                    <td>{log.module}</td>
                                    <td>{log.description}</td>
                                    <td>{log.ip_address ?? 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

AuditLog.layout = (page) => <AdminLayout>{page}</AdminLayout>
