<?php

namespace App\Http\Controllers\Dentist;

use App\Models\Notification;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('read', false)
            ->count();

        return Inertia::render('Dentist/Notifications/Index', [
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

        return back()->with('success', 'Notification marked as read');
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        
        Notification::where('user_id', $user->id)
            ->where('read', false)
            ->update(['read' => true]);

        return back()->with('success', 'All notifications marked as read');
    }

    public function destroy(Notification $notification)
    {
        $user = auth()->user();
        
        if ($notification->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $notification->delete();

        return back()->with('success', 'Notification deleted');
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
