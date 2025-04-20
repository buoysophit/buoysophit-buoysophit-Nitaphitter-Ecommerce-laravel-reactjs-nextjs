<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MarvelSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RefundReasonSeeder::class,
            RefundPolicySeeder::class,
            FaqSeeder::class,
            TermsAndConditionSeeder::class,
        ]);
    }
}
