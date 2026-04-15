<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (
            !Schema::hasColumn('patients', 'street_address') ||
            !Schema::hasColumn('patients', 'city') ||
            !Schema::hasColumn('patients', 'state') ||
            !Schema::hasColumn('patients', 'zip_code')
        ) {
            Schema::table('patients', function (Blueprint $table) {
                if (!Schema::hasColumn('patients', 'street_address')) {
                    $table->string('street_address')->nullable()->after('address');
                }

                if (!Schema::hasColumn('patients', 'city')) {
                    $table->string('city')->nullable()->after('street_address');
                }

                if (!Schema::hasColumn('patients', 'state')) {
                    $table->string('state')->nullable()->after('city');
                }

                if (!Schema::hasColumn('patients', 'zip_code')) {
                    $table->string('zip_code')->nullable()->after('state');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $columns = array_filter([
                Schema::hasColumn('patients', 'street_address') ? 'street_address' : null,
                Schema::hasColumn('patients', 'city') ? 'city' : null,
                Schema::hasColumn('patients', 'state') ? 'state' : null,
                Schema::hasColumn('patients', 'zip_code') ? 'zip_code' : null,
            ]);

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
