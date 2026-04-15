<?php

namespace App\Http\Controllers\Staff;

use App\Models\Notification;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(config('app.pagination.notifications'));

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('read', false)
            ->count();

        return Inertia::render('Staff/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $user = auth()->user();
        
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $notification->markAsRead();

        return redirect()->back(303);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        
        Notification::where('user_id', $user->id)
            ->where('read', false)
            ->update(['read' => true]);

        return redirect()->back(303);
    }

    public function destroy(Notification $notification)
    {
        $user = auth()->user();
        
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $notification->delete();

        return redirect()->back(303);
    }

    /**
     * Get unread notifications count (for header/badge)
     */
    public function getUnreadCount()
    {
        $user = auth()->user();
        
        return response()->json([
            'unreadCount' => Notification::where('user_id', $user->id)
                ->where('read', false)
                ->count(),
        ]);
    }
}
