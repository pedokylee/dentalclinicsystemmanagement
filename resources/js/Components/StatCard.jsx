export default function StatCard({ label, value, change, icon }) {
    const isPositive = change === undefined ? null : change >= 0

    return (
        <div className="dcms-card">
            <div className="flex items-start justify-between p-6">
                <div>
                    <p className="mb-2 text-sm text-[var(--dcms-text-soft)]">{label}</p>
                    <p className="text-3xl font-bold text-[var(--dcms-text)]">{value}</p>
                    {change !== undefined && (
                        <p className={`mt-2 text-sm font-semibold italic ${isPositive ? 'text-amber-600' : 'text-red-600'}`}>
                            {isPositive ? 'Up' : 'Down'} {Math.abs(change)}% vs prior period
                        </p>
                    )}
                </div>
                {icon && <div className="dcms-icon-badge">{icon}</div>}
            </div>
        </div>
    )
}
