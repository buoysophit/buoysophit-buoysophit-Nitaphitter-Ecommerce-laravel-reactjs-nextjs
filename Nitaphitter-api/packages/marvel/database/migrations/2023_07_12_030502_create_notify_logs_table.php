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
        Schema::create('notify_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('receiver');
            $table->foreign('receiver')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('sender')->nullable();
            $table->foreign('sender')->references('id')->on('users')->onDelete('cascade');
            $table->text('notify_type')->nullable();
            $table->text('notify_receiver_type')->nullable();
            $table->boolean('is_read')->default(false);
            $table->text('notify_tracker')->nullable();
            $table->text('notify_text')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notify_logs');
    }
};
