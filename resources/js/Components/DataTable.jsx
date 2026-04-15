export default function DataTable({ columns, rows, actions, theme = 'dark' }) {
    const themeClasses = {
        dark: {
            container: 'border-brand-border-light',
            header: 'bg-brand-bg-dark border-b border-brand-border-light',
            headerText: 'text-brand-text-light',
            headerLabel: 'text-brand-primary',
            rowText: 'text-brand-text-light',
            rowBorder: 'border-b border-brand-border-light hover:bg-brand-bg-hover transition-colors'
        },
        light: {
            container: 'border-gray-200',
            header: 'bg-gray-50 border-b border-gray-200',
            headerText: 'text-gray-900',
            headerLabel: 'text-gray-900',
            rowText: 'text-gray-900',
            rowBorder: 'border-b border-gray-200 hover:bg-gray-50 transition-colors'
        }
    }

    const classes = themeClasses[theme] || themeClasses.dark

    if (rows.length === 0) {
        return <div className={`text-center py-8 text-gray-500`}>No data available</div>
    }

    return (
        <div className={`overflow-x-auto rounded-lg border ${classes.container}`}>
            <table className={`w-full text-sm text-left ${classes.rowText}`}>
                <thead className={classes.header}>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className={`px-6 py-3 ${classes.headerLabel} font-semibold`}>
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className={`px-6 py-3 ${classes.headerLabel} font-semibold`}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className={classes.rowBorder}>
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
