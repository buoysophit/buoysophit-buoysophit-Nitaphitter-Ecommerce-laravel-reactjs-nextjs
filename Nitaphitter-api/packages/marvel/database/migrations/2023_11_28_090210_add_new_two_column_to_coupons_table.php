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
        Schema::table('coupons', function (Blueprint $table) {
            $table->boolean('target')->after('expire_at')->default(false)
                ->comment('Default value is false but For authenticated customer the value is true');
            $table->boolean('is_approve')->after('target')->default(false);
            $table->foreignId('shop_id')->after('is_approve')->nullable()->constrained('shops')->onDelete('cascade');
            $table->foreignId('user_id')->after('shop_id')->nullable()->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn('target');
            $table->dropColumn('is_approve');
        });
    }
};
