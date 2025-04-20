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
        Schema::table('flash_sale_requests', function (Blueprint $table) {
            $table->dropColumn('requested_product_ids');
            $table->string('note')->after('request_status')->nullable();
            $table->unsignedBigInteger('flash_sale_id')->after('title');
            $table->foreign('flash_sale_id')->references('id')->on('flash_sales')->onDelete('cascade');
            $table->string('language')->after('note')->default(DEFAULT_LANGUAGE);
        });

        Schema::create('flash_sale_requests_products', function (Blueprint $table) {
            $table->unsignedBigInteger('flash_sale_requests_id')->nullable();
            $table->foreign('flash_sale_requests_id')->references('id')->on('flash_sale_requests')->onDelete('cascade');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flash_sale_requests', function (Blueprint $table) {
            $table->dropColumn('note');
            $table->dropColumn('flash_sale_id');
            $table->dropColumn('language');
        });
        Schema::dropIfExists('flash_sale_requests_products');
    }
};
