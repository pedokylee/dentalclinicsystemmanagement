<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationsFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_role_can_mark_all_notifications_as_read(): void
    {
        foreach (['dentist', 'staff', 'patient'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'active' => true,
            ]);

            Notification::create([
                'user_id' => $user->id,
                'type' => 'appointment_booked',
                'title' => 'First',
                'message' => 'First message',
                'read' => false,
            ]);

            Notification::create([
                'user_id' => $user->id,
                'type' => 'appointment_reminder',
                'title' => 'Second',
                'message' => 'Second message',
                'read' => false,
            ]);

            $this->actingAs($user)
                ->post(route("{$role}.notifications.mark-all-read"))
                ->assertRedirect();

            $this->assertSame(
                0,
                Notification::where('user_id', $user->id)->where('read', false)->count(),
                "Failed asserting all {$role} notifications were marked as read."
            );

            auth()->logout();
        }
    }

    public function test_each_role_can_mark_single_notification_as_read_and_delete_it(): void
    {
        foreach (['dentist', 'staff', 'patient'] as $role) {
            $user = User::factory()->create([
                'role' => $role,
                'active' => true,
            ]);

            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => 'appointment_booked',
                'title' => 'Own notification',
                'message' => 'Own message',
                'read' => false,
            ]);

            $this->actingAs($user)
                ->patch(route("{$role}.notifications.read", $notification))
                ->assertRedirect();

            $this->assertDatabaseHas('notifications', [
                'id' => $notification->id,
                'read' => true,
            ]);

            $this->actingAs($user)
                ->delete(route("{$role}.notifications.destroy", $notification))
                ->assertRedirect();

            $this->assertDatabaseMissing('notifications', [
                'id' => $notification->id,
            ]);

            auth()->logout();
        }
    }

    public function test_users_cannot_modify_other_users_notifications(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $otherStaff = User::factory()->create([
            'role' => 'staff',
            'active' => true,
        ]);

        $notification = Notification::create([
            'user_id' => $otherStaff->id,
            'type' => 'appointment_booked',
            'title' => 'Other notification',
            'message' => 'Other message',
            'read' => false,
        ]);

        $this->actingAs($staff)
            ->patch(route('staff.notifications.read', $notification))
            ->assertForbidden();

        $this->actingAs($staff)
            ->delete(route('staff.notifications.destroy', $notification))
            ->assertForbidden();
    }

    public function test_unread_count_endpoint_returns_real_total(): void
    {
        $dentist = User::factory()->create([
            'role' => 'dentist',
            'active' => true,
        ]);

        Notification::create([
            'user_id' => $dentist->id,
            'type' => 'appointment_booked',
            'title' => 'Unread',
            'message' => 'Unread message',
            'read' => false,
        ]);

        Notification::create([
            'user_id' => $dentist->id,
            'type' => 'appointment_reminder',
            'title' => 'Read',
            'message' => 'Read message',
            'read' => true,
        ]);

        $this->actingAs($dentist)
            ->getJson(route('dentist.notifications.unread-count'))
            ->assertOk()
            ->assertJson([
                'unreadCount' => 1,
            ]);
    }
}
