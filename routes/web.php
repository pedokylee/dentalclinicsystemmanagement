<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Dentist\DashboardController as DentistDashboardController;
use App\Http\Controllers\Dentist\PatientController as DentistPatientController;
use App\Http\Controllers\Dentist\TreatmentController;
use App\Http\Controllers\Dentist\AppointmentController as DentistAppointmentController;
use App\Http\Controllers\Dentist\NotificationController as DentistNotificationController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\PatientController as StaffPatientController;
use App\Http\Controllers\Staff\AppointmentController as StaffAppointmentController;
use App\Http\Controllers\Staff\CheckinController;
use App\Http\Controllers\Staff\NotificationController as StaffNotificationController;
use App\Http\Controllers\Patient\DashboardController as PatientDashboardController;
use App\Http\Controllers\Patient\ProfileController as PatientProfileController;
use App\Http\Controllers\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Patient\TreatmentHistoryController;
use App\Http\Controllers\Patient\NotificationController as PatientNotificationController;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Home');
});

// Public Appointment Booking
Route::get('/appointments/book', [PatientAppointmentController::class, 'publicBook'])->middleware('auth')->name('appointments.book');
Route::get('/appointments/available-dentists', [PatientAppointmentController::class, 'getDentists'])->middleware('auth')->name('appointments.dentists');
Route::get('/appointments/available-times', [PatientAppointmentController::class, 'getAvailableTimes'])->middleware('auth')->name('appointments.times');
Route::post('/appointments/store-public', [PatientAppointmentController::class, 'storePublic'])->middleware('auth')->name('appointments.store-public');
Route::get('/appointments/confirmation/{appointment}', [PatientAppointmentController::class, 'confirmation'])->middleware('auth')->name('appointments.confirmation');

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    // Profile
    Route::get('/profile', fn() => Inertia::render('Admin/Profile', ['user' => auth()->user()]))->name('admin.profile');
    Route::patch('/profile', fn() => back()->with('success', 'Profile updated'))->name('admin.profile.update');
    Route::patch('/profile/password', fn() => back()->with('success', 'Password updated'))->name('admin.profile.password');
    
    // User Management
    Route::resource('/users', AdminUserController::class);
    Route::get('/users/export/pdf', [AdminUserController::class, 'exportPdf'])->name('admin.users.export-pdf');
    Route::get('/users/export/excel', [AdminUserController::class, 'exportExcel'])->name('admin.users.export-excel');
    
    // Reports & Analytics
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf'])->name('admin.reports.export-pdf');
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel'])->name('admin.reports.export-excel');
    Route::get('/audit-log', [AuditLogController::class, 'index'])->name('admin.audit-log');
    Route::get('/audit-log/export-pdf', [AuditLogController::class, 'exportPdf'])->name('admin.audit-log.export-pdf');
    Route::get('/audit-log/export-excel', [AuditLogController::class, 'exportExcel'])->name('admin.audit-log.export-excel');
    
    // Backup & System
    Route::resource('/backup', BackupController::class);
    Route::get('/config', fn() => Inertia::render('Admin/Config'))->name('admin.config');
    Route::post('/config', fn() => response()->json(['message' => 'Config saved']))->name('admin.config.save');
});

// Dentist Routes
Route::middleware(['auth', 'role:dentist'])->prefix('dentist')->group(function () {
    Route::get('/dashboard', [DentistDashboardController::class, 'index'])->name('dentist.dashboard');
    
    // Profile
    Route::get('/profile', fn() => Inertia::render('Dentist/Profile', ['user' => auth()->user(), 'dentist' => auth()->user()->dentist]))->name('dentist.profile');
    Route::patch('/profile', fn() => back()->with('success', 'Profile updated'))->name('dentist.profile.update');
    Route::patch('/profile/password', fn() => back()->with('success', 'Password updated'))->name('dentist.profile.password');
    
    Route::resource('/patients', DentistPatientController::class, ['only' => ['index', 'show']]);
    Route::get('/patients/export/pdf', [DentistPatientController::class, 'exportPdf'])->name('dentist.patients.export-pdf');
    Route::get('/patients/export/excel', [DentistPatientController::class, 'exportExcel'])->name('dentist.patients.export-excel');
    
    Route::resource('/treatment', TreatmentController::class, ['only' => ['create', 'store', 'edit', 'update']]);
    
    Route::resource('/appointments', DentistAppointmentController::class, ['only' => ['index', 'destroy']]);
    
    Route::get('/notifications', [DentistNotificationController::class, 'index'])->name('dentist.notifications.index');
    Route::get('/notifications/unread-count', [DentistNotificationController::class, 'getUnreadCount'])->name('dentist.notifications.unread-count');
    Route::patch('/notifications/{notification}/read', [DentistNotificationController::class, 'markAsRead'])->name('dentist.notifications.read');
    Route::post('/notifications/mark-all-read', [DentistNotificationController::class, 'markAllAsRead'])->name('dentist.notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [DentistNotificationController::class, 'destroy'])->name('dentist.notifications.destroy');
});

// Staff Routes
Route::middleware(['auth', 'role:staff'])->prefix('staff')->group(function () {
    Route::get('/dashboard', [StaffDashboardController::class, 'index'])->name('staff.dashboard');
    
    // Profile
    Route::get('/profile', fn() => Inertia::render('Staff/Profile', ['user' => auth()->user()]))->name('staff.profile');
    Route::patch('/profile', fn() => back()->with('success', 'Profile updated'))->name('staff.profile.update');
    Route::patch('/profile/password', fn() => back()->with('success', 'Password updated'))->name('staff.profile.password');
    
    Route::resource('/patients', StaffPatientController::class, ['only' => ['create', 'store']]);
    
    Route::resource('/appointments', StaffAppointmentController::class);
    Route::get('/appointments/export/pdf', [StaffAppointmentController::class, 'exportPdf'])->name('staff.appointments.export-pdf');
    Route::get('/appointments/export/excel', [StaffAppointmentController::class, 'exportExcel'])->name('staff.appointments.export-excel');
    
    Route::resource('/checkin', CheckinController::class, ['only' => ['index', 'update']]);
    
    Route::get('/notifications', [StaffNotificationController::class, 'index'])->name('staff.notifications.index');
    Route::get('/notifications/unread-count', [StaffNotificationController::class, 'getUnreadCount'])->name('staff.notifications.unread-count');
    Route::patch('/notifications/{notification}/read', [StaffNotificationController::class, 'markAsRead'])->name('staff.notifications.read');
    Route::post('/notifications/mark-all-read', [StaffNotificationController::class, 'markAllAsRead'])->name('staff.notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [StaffNotificationController::class, 'destroy'])->name('staff.notifications.destroy');
});

// Patient Routes
Route::middleware(['auth', 'role:patient'])->prefix('patient')->group(function () {
    Route::get('/dashboard', [PatientDashboardController::class, 'index'])->name('patient.dashboard');
    
    // Profile with approval workflow
    Route::get('/profile', [PatientProfileController::class, 'show'])->name('patient.profile');
    Route::patch('/profile', [PatientProfileController::class, 'update'])->name('patient.profile.update');
    Route::post('/profile/request-change', [PatientProfileController::class, 'requestChange'])->name('patient.profile.request-change');
    Route::patch('/profile/password', [PatientProfileController::class, 'updatePassword'])->name('patient.profile.password');
    
    Route::resource('/appointments', PatientAppointmentController::class, ['only' => ['index', 'destroy']]);
    Route::get('/appointments/export/pdf', [PatientAppointmentController::class, 'exportPdf'])->name('patient.appointments.export-pdf');
    Route::get('/appointments/export/excel', [PatientAppointmentController::class, 'exportExcel'])->name('patient.appointments.export-excel');
    
    Route::get('/history', [TreatmentHistoryController::class, 'index'])->name('patient.history.index');
    Route::get('/history/{id}/download', [TreatmentHistoryController::class, 'download'])->name('patient.history.download');
    
    Route::get('/notifications', [PatientNotificationController::class, 'index'])->name('patient.notifications.index');
    Route::get('/notifications/unread-count', [PatientNotificationController::class, 'getUnreadCount'])->name('patient.notifications.unread-count');
    Route::patch('/notifications/{notification}/read', [PatientNotificationController::class, 'markAsRead'])->name('patient.notifications.read');
    Route::post('/notifications/mark-all-read', [PatientNotificationController::class, 'markAllAsRead'])->name('patient.notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [PatientNotificationController::class, 'destroy'])->name('patient.notifications.destroy');
});

require __DIR__.'/auth.php';
