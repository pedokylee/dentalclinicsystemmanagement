export default function StatCard({ label, value, change, icon }) {
    const isPositive = change && change > 0

    return (
        <div className="bg-white rounded-lg border-l-4 border-teal-500 p-6 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-2">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {change !== undefined && (
                        <p className={`text-sm mt-2 font-medium ${isPositive ? 'text-teal-600' : 'text-red-600'}`}>
                            {isPositive ? '↑' : '↓'} {Math.abs(change)}% {isPositive ? 'vs yesterday' : 'vs yesterday'}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-lg group-hover:bg-teal-200 transition-colors">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}
