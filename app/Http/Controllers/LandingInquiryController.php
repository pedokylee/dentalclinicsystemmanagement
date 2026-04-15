<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\PatientInquiry;
use App\Models\User;
use App\Support\PatientInquiryFeature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LandingInquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        if (! PatientInquiryFeature::isAvailable()) {
            return redirect()->route('home')->with('error', PatientInquiryFeature::unavailableMessage());
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'preferred_date' => 'nullable|date|after_or_equal:today',
            'appointment_type' => 'nullable|string|max:100',
            'concern' => 'nullable|string|max:1500',
        ]);

        $matchedUser = User::query()
            ->where('email', $validated['email'])
            ->first();

        $inquiry = DB::transaction(function () use ($validated, $matchedUser) {
            $inquiry = PatientInquiry::create([
                ...$validated,
                'status' => 'pending_verification',
                'source' => 'landing_page',
                'matched_user_id' => $matchedUser?->id,
            ]);

            $staffUsers = User::query()
                ->where('role', 'staff')
                ->where('active', true)
                ->get(['id']);

            $preferredDate = $inquiry->preferred_date?->format('M d, Y') ?? 'No preferred date';
            $appointmentType = $inquiry->appointment_type ?: 'General inquiry';
            $existingMarker = $matchedUser ? ' Existing account found for this email.' : '';

            foreach ($staffUsers as $staffUser) {
                Notification::create([
                    'user_id' => $staffUser->id,
                    'type' => 'patient_inquiry_submitted',
                    'related_id' => $inquiry->id,
                    'title' => 'New Patient Verification Request',
                    'message' => "{$inquiry->full_name} submitted a landing page inquiry for {$appointmentType}. Preferred date: {$preferredDate}. Contact: {$inquiry->email} / {$inquiry->phone}.{$existingMarker}",
                    'read' => false,
                ]);
            }

            return $inquiry;
        });

        AuditLog::log(
            'created',
            'patient_inquiries',
            "Landing inquiry submitted by {$inquiry->email}",
            null
        );

        return redirect()->route('home')->with('success', 'Your request has been sent. Our clinic staff will review your details and contact you to verify the appointment.');
    }
}
