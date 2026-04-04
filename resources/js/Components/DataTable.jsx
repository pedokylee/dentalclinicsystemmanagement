export default function DataTable({ columns, rows, actions }) {
    if (rows.length === 0) {
        return <div className="text-center py-8 text-[#7ABFB9]">No data available</div>
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-[rgba(45,212,191,0.12)]">
            <table className="w-full text-sm text-left text-[#E2FAF7]">
                <thead className="bg-[#0E2C28] border-b border-[rgba(45,212,191,0.12)]">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-3 text-[#0D9488] font-semibold">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3 text-[#0D9488] font-semibold">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-[rgba(45,212,191,0.12)] hover:bg-[#0F2724] transition-colors">
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4">
                                    {row[col.key] ?? '-'}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 space-x-2">
                                    {actions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
