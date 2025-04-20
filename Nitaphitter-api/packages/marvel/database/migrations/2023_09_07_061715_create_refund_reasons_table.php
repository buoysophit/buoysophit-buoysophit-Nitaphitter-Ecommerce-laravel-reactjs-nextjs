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
        Schema::create('refund_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('language')->default(DEFAULT_LANGUAGE);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('refunds', function (Blueprint $table) {
            $table->foreignId('refund_reason_id')->after('shop_id')->nullable()->constrained('refund_reasons')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refunds', function (Blueprint $table) {
            $table->dropForeign(['refund_reason_id']);
        });
        Schema::dropIfExists('refund_reasons');
    }
};
