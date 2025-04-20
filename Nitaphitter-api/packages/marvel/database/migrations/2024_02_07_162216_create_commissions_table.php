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
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->string('sub_level');
            $table->text('description');
            $table->integer('min_balance');
            $table->string('max_balance');
            $table->float('commission');
            $table->json('image')->nullable();
            $table->string('language')->default(DEFAULT_LANGUAGE);
            $table->timestamps();
        });

        Schema::table('balances', function (Blueprint $table) {
            $table->boolean('is_custom_commission')->after('current_balance')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
        Schema::table('balances', function (Blueprint $table) {
            $table->dropColumn('is_custom_commission');
        });
    }
};
