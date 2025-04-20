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
        Schema::table('products', function (Blueprint $table) {
            $table->integer('sold_quantity')->after('quantity')->default(0);
        });

        Schema::table('variation_options', function (Blueprint $table) {
            $table->integer('sold_quantity')->after('quantity')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sold_quantity');
        });
        Schema::table('variation_options', function (Blueprint $table) {
            $table->dropColumn('sold_quantity');
        });
    }
};
