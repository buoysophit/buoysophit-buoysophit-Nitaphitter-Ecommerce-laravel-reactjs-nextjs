<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class RefundReasonSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('refund_reasons')->insert([
            [
                "name" => "Product Not as Described",
                "slug" => "product-not-as-described",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Wrong Item Shipped",
                "slug" => "wrong-item-shipped",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Damaged Item",
                "slug" => "damaged-item",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Cancelled Order",
                "slug" => "cancelled-order",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Late Delivery",
                "slug" => "late-delivery",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Item Not Needed",
                "slug" => "item-not-needed",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Changed Mind",
                "slug" => "changed-mind",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            [
                "name" => "Others",
                "slug" => "others",
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
            ...$this->getGermanDummyData()
        ]);
    }

    /**
     * getGermanDummyData
     *
     * @return array
     */
    private function getGermanDummyData(): array
    {

        if (!TRANSLATION_ENABLED) {
            return [];
        } else {
            return [
                [
                    "name" => "Produkt nicht wie beschrieben",
                    "slug" => "produkt-nicht-wie-beschrieben",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Falscher Artikel geliefert",
                    "slug" => "falscher-artikel-geliefert",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Beschädigter Artikel",
                    "slug" => "beschädigter-artikel",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Bestellung storniert",
                    "slug" => "bestellung-storniert",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Lieferung verzögert",
                    "slug" => "lieferung-verzögert",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Artikel nicht benötigt",
                    "slug" => "artikel-nicht-benötigt",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Meinung geändert",
                    "slug" => "meinung-geändert",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
                [
                    "name" => "Sonstiges",
                    "slug" => "sonstiges",
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                    'deleted_at' => null,
                ],
            ];
        }
    }

    // private function getEnglishDummyData(): array
    // {
    //     return [
    //         [
    //             "name" => "Product Not as Described",
    //             "slug" => "product-not-as-described",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Wrong Item Shipped",
    //             "slug" => "wrong-item-shipped",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Damaged Item",
    //             "slug" => "damaged-item",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Cancelled Order",
    //             "slug" => "cancelled-order",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Late Delivery",
    //             "slug" => "late-delivery",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Item Not Needed",
    //             "slug" => "item-not-needed",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Changed Mind",
    //             "slug" => "changed-mind",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ],
    //         [
    //             "name" => "Others",
    //             "slug" => "others",
    //             "language" => "en",
    //             'created_at' => Carbon::now(),
    //             'updated_at' => Carbon::now(),
    //             'deleted_at' => null,
    //         ]

    //     ];
    // }
}
