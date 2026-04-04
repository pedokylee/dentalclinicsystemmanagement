<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class UsersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $role;

    public function __construct($role = 'all')
    {
        $this->role = $role;
    }

    public function collection()
    {
        $query = User::query();
        if ($this->role !== 'all') {
            $query->where('role', $this->role);
        }
        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Role',
            'Email Verified',
            'Created At',
        ];
    }

    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            ucfirst($user->role),
            $user->email_verified_at ? 'Yes' : 'No',
            $user->created_at?->format('M d, Y H:i') ?? 'N/A',
        ];
    }
}
