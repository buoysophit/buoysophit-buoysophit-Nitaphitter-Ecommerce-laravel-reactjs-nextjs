<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Marvel\Enums\FlashSaleType;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->dateTime('start_date')->default(now());
            $table->dateTime('end_date');
            $table->boolean('sale_status')->default(false);
            $table->enum('type', FlashSaleType::getValues())->default(FlashSaleType::DEFAULT);
            $table->integer('rate')->nullable();
            $table->json('sale_builder')->nullable();
            $table->json('image')->nullable();
            $table->json('cover_image')->nullable();
            $table->string('language')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('flash_sale_requests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->json('requested_product_ids')->nullable();
            $table->boolean('request_status')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('flash_sale_products', function (Blueprint $table) {
            $table->unsignedBigInteger('flash_sale_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('flash_sale_id')->references('id')->on('flash_sales')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
        Schema::dropIfExists('flash_sale_requests');
        Schema::dropIfExists('flash_sale_products');
    }
};