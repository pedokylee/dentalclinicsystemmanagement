import StaffLayout from '@/Layouts/StaffLayout'
import { Link } from '@inertiajs/react'

export default function NotificationsIndex({ notifications, unreadCount }) {
    const { data, links } = notifications

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment_cancelled':
                return '❌'
            case 'appointment_confirmed':
                return '✅'
            case 'appointment_reminder':
                return '⏰'
            default:
                return '📢'
        }
    }

    const getNotificationColor = (type) => {
        switch (type) {
            case 'appointment_cancelled':
                return 'border-l-red-500 bg-red-50'
            case 'appointment_confirmed':
                return 'border-l-green-500 bg-green-50'
            case 'appointment_reminder':
                return 'border-l-yellow-500 bg-yellow-50'
            default:
                return 'border-l-blue-500 bg-blue-50'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#E2FAF7]">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-sm text-[#0D9488] mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        className="px-4 py-2 bg-[#0D9488] text-white rounded hover:bg-[#14B8A6] transition-colors text-sm"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {data && data.length > 0 ? (
                    data.map((notification) => (
                        <div
                            key={notification.id}
                            className={`border-l-4 p-4 rounded-lg transition-all ${getNotificationColor(notification.type)} ${
                                !notification.read ? 'opacity-100 ring-1 ring-offset-2 ring-[#0D9488]' : 'opacity-75'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 flex items-start gap-3">
                                    <span className="text-2xl mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {notification.title}
                                        </h3>
                                        <p className="text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(notification.created_at).toLocaleDateString()} at{' '}
                                            {new Date(notification.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="text-gray-500 hover:text-gray-700 text-lg"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[#92A9B4] text-lg">No notifications yet</p>
                        <p className="text-[#5A7A82] text-sm mt-1">
                            Staff notifications will appear here
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {links && links.length > 1 && (
                <div className="flex justify-center gap-1 mt-6">
                    {links.map((link) => 
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                className={`px-3 py-2 rounded text-sm ${
                                    link.active
                                        ? 'bg-[#0D9488] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={link.label}
                                className="px-3 py-2 rounded text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    )
}

NotificationsIndex.layout = (page) => <StaffLayout>{page}</StaffLayout>
