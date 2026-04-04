<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\AuditLog;
use App\Exports\UsersExport;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'all');
        
        $query = User::query();
        if ($role !== 'all') {
            $query->where('role', $role);
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['role' => $role],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,dentist,staff,patient',
        ]);

        $user = User::create([
            ...$validated,
            'password' => bcrypt($validated['password']),
        ]);

        AuditLog::log('created', 'users', "Created user: {$user->name}");

        return redirect('/admin/users')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,dentist,staff,patient',
        ]);

        $user->update($validated);

        AuditLog::log('updated', 'users', "Updated user: {$user->name}");

        return redirect('/admin/users')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        AuditLog::log('deleted', 'users', "Deleted user: {$user->name}");

        return redirect('/admin/users')->with('success', 'User deleted successfully.');
    }

    public function exportPdf(Request $request)
    {
        $role = $request->query('role', 'all');
        
        $query = User::query();
        if ($role !== 'all') {
            $query->where('role', $role);
        }

        $users = $query->get();

        AuditLog::log('exported', 'users', "Admin exported users list as PDF");

        $pdf = Pdf::loadView('pdf.users', compact('users', 'role'));
        return $pdf->download('users-' . now()->format('Y-m-d-His') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $role = $request->query('role', 'all');

        AuditLog::log('exported', 'users', "Admin exported users list as Excel");

        return Excel::download(
            new UsersExport($role),
            'users-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }
}
