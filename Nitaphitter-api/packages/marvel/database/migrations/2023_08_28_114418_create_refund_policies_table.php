<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Marvel\Enums\RefundPolicyStatus;
use Marvel\Enums\RefundPolicyTarget;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refund_policies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('target', RefundPolicyTarget::getValues())->default(RefundPolicyTarget::VENDOR);
            $table->string('language')->default(DEFAULT_LANGUAGE);
            $table->enum('status', RefundPolicyStatus::getValues())->default(RefundPolicyStatus::PENDING);
            $table->foreignId('shop_id')->nullable()->constrained('shops')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('refunds', function (Blueprint $table) {
            $table->foreignId('refund_policy_id')->after('customer_id')->nullable()->constrained('refund_policies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refunds', function (Blueprint $table) {
            $table->dropForeign(['refund_policy_id']);
        });
        Schema::dropIfExists('refund_policies');
    }
};
