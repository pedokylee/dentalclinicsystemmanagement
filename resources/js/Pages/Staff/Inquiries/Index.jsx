import StaffLayout from '@/Layouts/StaffLayout'
import StatCard from '@/Components/StatCard'
import { Link, router } from '@inertiajs/react'
import { CheckCircle2, SearchCheck, ShieldX, UserPlus2, Users } from 'lucide-react'
import { useState } from 'react'

const STATUS_STYLES = {
    pending_verification: 'dcms-chip-gold',
    converted: 'dcms-chip-teal',
    rejected: 'dcms-chip-red',
}

export default function InquiryIndex({ inquiries, filters, stats }) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        status: filters.status ?? 'pending_verification',
    })

    const applyFilters = (nextForm) => {
        router.get('/staff/inquiries', nextForm, {
            preserveState: true,
            preserveScroll: true,
            only: ['inquiries', 'filters', 'stats'],
        })
    }

    const rejectInquiry = (id) => {
        router.patch(`/staff/inquiries/${id}/reject`, {}, {
            preserveScroll: true,
        })
    }

    return (
        <div className="dcms-page">
            <div className="dcms-page-header">
                <div>
                    <h1 className="dcms-page-title">Patient Inquiries</h1>
                    <p className="dcms-page-subtitle">Review landing-page submissions, verify details, and convert approved inquiries into registered patients.</p>
                </div>
                <Link href="/staff/patients/create" className="dcms-btn-secondary">
                    <UserPlus2 className="h-4 w-4" /> Manual Registration
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <StatCard label="Pending Review" value={stats.pending} icon={<SearchCheck className="h-5 w-5" />} />
                <StatCard label="Converted" value={stats.converted} icon={<CheckCircle2 className="h-5 w-5" />} />
                <StatCard label="Rejected" value={stats.rejected} icon={<ShieldX className="h-5 w-5" />} />
                <StatCard label="Total Inquiries" value={stats.total} icon={<Users className="h-5 w-5" />} />
            </div>

            <section className="dcms-card">
                <div className="dcms-card-body space-y-5">
                    <div className="grid gap-4 md:grid-cols-[1.2fr_0.55fr_auto]">
                        <input
                            className="dcms-input"
                            value={form.search}
                            onChange={(event) => setForm((current) => ({ ...current, search: event.target.value }))}
                            placeholder="Search by name, email, or phone"
                        />
                        <select
                            className="dcms-select"
                            value={form.status}
                            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                        >
                            <option value="pending_verification">Pending Review</option>
                            <option value="converted">Converted</option>
                            <option value="rejected">Rejected</option>
                            <option value="all">All Statuses</option>
                        </select>
                        <button className="dcms-btn-primary justify-center" onClick={() => applyFilters(form)}>
                            Apply Filters
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="dcms-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Contact</th>
                                    <th>Requested Visit</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.data.map((inquiry) => (
                                    <tr key={inquiry.id}>
                                        <td>
                                            <p className="font-semibold">{inquiry.full_name}</p>
                                            <p className="text-xs text-[var(--dcms-text-soft)]">{inquiry.appointment_type || 'General inquiry'}</p>
                                        </td>
                                        <td>
                                            <p>{inquiry.email}</p>
                                            <p className="text-xs text-[var(--dcms-text-soft)]">{inquiry.phone}</p>
                                        </td>
                                        <td>
                                            {inquiry.preferred_date ? new Date(inquiry.preferred_date).toLocaleDateString() : 'No preferred date'}
                                        </td>
                                        <td>
                                            <span className={STATUS_STYLES[inquiry.status] ?? 'dcms-chip'}>
                                                {inquiry.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td>{new Date(inquiry.created_at).toLocaleString()}</td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                {inquiry.status === 'pending_verification' ? (
                                                    <>
                                                        <Link href={`/staff/inquiries/${inquiry.id}/convert`} className="dcms-btn-primary !px-3 !py-2">
                                                            Convert
                                                        </Link>
                                                        <button className="dcms-btn-secondary !border-red-200 !text-red-600 !px-3 !py-2 hover:!bg-red-50" onClick={() => rejectInquiry(inquiry.id)}>
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : inquiry.status === 'converted' ? (
                                                    <Link href={`/staff/inquiries/${inquiry.id}/convert`} className="dcms-btn-secondary !px-3 !py-2">
                                                        View Conversion
                                                    </Link>
                                                ) : (
                                                    <span className="text-sm text-[var(--dcms-text-soft)]">Handled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {inquiries.data.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-[var(--dcms-border)] px-6 py-12 text-center text-[var(--dcms-text-soft)]">
                            No inquiries match the current filters.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

InquiryIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
