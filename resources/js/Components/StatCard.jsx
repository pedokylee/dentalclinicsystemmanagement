export default function StatCard({ label, value, color = 'teal', icon }) {
    const colors = {
        teal: 'bg-[#0E2C28] border-[#0D9488]',
        gold: 'bg-[#0E2C28] border-[#F59E0B]',
        blue: 'bg-[#0E2C28] border-[#3B82F6]',
    }

    const textColors = {
        teal: 'text-[#0D9488]',
        gold: 'text-[#F59E0B]',
        blue: 'text-[#3B82F6]',
    }

    return (
        <div className={`${colors[color]} border-l-4 rounded-lg p-6 text-[#E2FAF7]`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#7ABFB9] mb-2">{label}</p>
                    <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
                </div>
                {icon && <div className="text-4xl opacity-20">{icon}</div>}
            </div>
        </div>
    )
}
