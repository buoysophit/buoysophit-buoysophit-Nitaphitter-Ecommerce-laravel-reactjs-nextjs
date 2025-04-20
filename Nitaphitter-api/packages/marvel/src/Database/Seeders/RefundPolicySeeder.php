<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RefundPolicySeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('refund_policies')->insert([
            [
                "title" => "Vendor Return Policy",
                "slug" => "vendor-return-policy",
                "description" => "Our vendor return policy ensures that you can return products within 30 days of purchase if they are damaged or not as described.",
                "target" => "vendor",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 1,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Customer Return Policy",
                "slug" => "customer-return-policy",
                "description" => "Our customer return policy allows you to return products within 14 days of purchase for a full refund, no questions asked.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 2,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Electronics Return Policy",
                "slug" => "electronics-return-policy",
                "description" => "For electronics, our return policy extends to 60 days. We stand by the quality of our electronic products.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 1,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Furniture Return Policy",
                "slug" => "furniture-return-policy",
                "description" => "Our furniture return policy allows you to return furniture within 7 days if it doesn't meet your expectations. Customer satisfaction is our priority.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 1,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "title" => "Custom Orders Policy",
                "slug" => "custom-orders-policy",
                "description" => "Please note that custom orders are not eligible for returns or refunds. We craft custom items to your specifications.",
                "target" => "customer",
                "language" => "en",
                "status" => "approved",
                "shop_id" => 2,
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            ...$this->refundPolicySeederGerman()
        ]);
    }


    /**
     * refundPolicySeederGerman
     *
     * @return array
     */
    private function refundPolicySeederGerman(): array
    {
        if (!TRANSLATION_ENABLED) {
            return [];
        } else {
            return [
                [
                    "title" => "Rückgabebedingungen des Anbieters",
                    "slug" => "rückgabebedingungen-des-anbieters",
                    "description" => "Unsere Rückgaberichtlinie des Anbieters stellt sicher, dass Sie Produkte innerhalb von 30 Tagen nach dem Kauf zurückgeben können, wenn sie beschädigt sind oder nicht der Beschreibung entsprechen.",
                    "target" => "vendor",
                    "language" => "de",
                    "status" => "approved",
                    "shop_id" => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [
                    "title" => "Rückgabebedingungen für Kunden",
                    "slug" => "rückgabebedingungen-für-kunden",
                    "description" => "Unsere Rückgaberichtlinie für Kunden ermöglicht es Ihnen, Produkte innerhalb von 14 Tagen nach dem Kauf gegen eine vollständige Rückerstattung zurückzugeben, ohne dass Fragen gestellt werden.",
                    "target" => "customer",
                    "language" => "de",
                    "status" => "approved",
                    "shop_id" => 2,
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [
                    "title" => "Rückgabebedingungen für Elektronik",
                    "slug" => "rückgabebedingungen-für-elektronik",
                    "description" => "Für Elektronik gilt eine Rückgabefrist von 60 Tagen. Wir stehen für die Qualität unserer elektronischen Produkte.",
                    "target" => "customer",
                    "language" => "de",
                    "status" => "approved",
                    "shop_id" => 3,
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [
                    "title" => "Rückgabebedingungen für Möbel",
                    "slug" => "rückgabebedingungen-für-möbel",
                    "description" => "Unsere Rückgaberichtlinie für Möbel ermöglicht es Ihnen, Möbel innerhalb von 7 Tagen zurückzugeben, wenn sie nicht Ihren Erwartungen entsprechen. Kundenzufriedenheit ist unsere Priorität.",
                    "target" => "customer",
                    "language" => "de",
                    "status" => "approved",
                    "shop_id" => 4,
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [
                    "title" => "Richtlinien für Sonderanfertigungen",
                    "slug" => "richtlinien-für-sonderanfertigungen",
                    "description" => "Bitte beachten Sie, dass Sonderanfertigungen von der Rückgabe oder Rückerstattung ausgeschlossen sind. Wir fertigen maßgeschneiderte Artikel nach Ihren Vorgaben.",
                    "target" => "customer",
                    "language" => "de",
                    "status" => "approved",
                    "shop_id" => 5,
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
            ];
        }
    }
}
