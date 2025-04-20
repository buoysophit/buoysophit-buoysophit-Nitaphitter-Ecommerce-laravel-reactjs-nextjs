<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Marvel\Enums\DefaultStatusType;
use Marvel\Enums\ProductVisibilityStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ownership_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_identifier', 50);
            $table->foreignId('from')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained('shops', 'id')->cascadeOnDelete();
            $table->foreignId('to')->constrained('users', 'id')->cascadeOnDelete();
            $table->text('message')->nullable();
            $table->foreignId('created_by')->constrained('users', 'id')->cascadeOnDelete();
            $table->enum('status', DefaultStatusType::getValues())->default(DefaultStatusType::PENDING);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['id', 'transaction_identifier', 'created_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->enum('visibility', ProductVisibilityStatus::getValues())->after('status')->default(ProductVisibilityStatus::VISIBILITY_PUBLIC);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ownership_transfers');
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};
