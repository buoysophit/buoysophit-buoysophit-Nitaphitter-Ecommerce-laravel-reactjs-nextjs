<?php

namespace Marvel\Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TermsAndConditionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('terms_and_conditions')->insert([
            [
                "user_id" => 1,
                "shop_id" => null,
                "title" => "Disclaimers and Limitation of Liability",
                "slug" => "disclaimers-and-limitation-of-liability",
                "description" => 'The Website is provided "as is" and "as available" without any warranties, either expressed or implied. Pickbazar shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the Website.',
                "type" => "global",
                "issued_by" => "Super Admin",
                "is_approved" => true,
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "user_id" => 1,
                "shop_id" => null,
                "title" => "Intellectual Property",
                "slug" => "intellectual-property",
                "description" => "The Website and its original content, features, and functionality are owned by [Your Company] and are protected by international copyright, trademark, and other intellectual property laws.",
                "type" => "global",
                "issued_by" => "Super Admin",
                "is_approved" => true,
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "user_id" => 1,
                "shop_id" => null,
                "title" => "Privacy Policy",
                "slug" => "privacy-policy",
                "description" => "Your use of the Website is also governed by our Privacy Policy, which can be found [link to Privacy Policy]. By using the Website, you consent to the practices described in the Privacy Policy.",
                "type" => "global",
                "issued_by" => "Super Admin",
                "is_approved" => true,
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "user_id" => 1,
                "shop_id" => null,
                "title" => "Use of the Website",
                "slug" => "use-of-the-website",
                "description" => "You must be at least [Age] years old to use this Website. By using the Website, you represent and warrant that you are at least [Age] years old. You agree to use the Website for lawful purposes only and in a manner that does not infringe upon the rights of others.",
                "type" => "global",
                "issued_by" => "Super Admin",
                "is_approved" => true,
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            [
                "user_id" => 1,
                "shop_id" => null,
                "title" => "Acceptance of Terms",
                "slug" => "acceptance-of-terms",
                "description" => "By using this Website, you agree to comply with and be bound by these terms and conditions. If you do not agree to these terms, please do not use the Website.",
                "type" => "global",
                "issued_by" => "Super Admin",
                "is_approved" => true,
                "language" => "en",
                'created_at' => Carbon::now(),
                'updated_at' => null,
                'deleted_at' => null,
            ],
            ...$this->termsAndConditionsSeederGerman()
        ]);
    }

    /**
     * termsAndConditionsSeederGerman
     *
     * @return array
     */
    private function termsAndConditionsSeederGerman(): array
    {
        if (!TRANSLATION_ENABLED) {
            return [];
        } else {
            return [
                [
                    "user_id" => 1,
                    "shop_id" => null,
                    "title" => "Haftungsausschluss und Haftungsbeschränkung",
                    "slug" => "haftungsausschluss-und-haftungsbeschränkung",
                    "description" => 'Die Website wird „wie besehen“ und „wie verfügbar“ ohne jegliche ausdrückliche oder stillschweigende Gewährleistung bereitgestellt. Pickbazar haftet nicht für direkte, indirekte, zufällige, besondere, Folge- oder Strafschäden, die sich aus der Nutzung oder Unmöglichkeit der Nutzung der Website ergeben.',
                    "type" => "global",
                    "issued_by" => "Super Admin",
                    "is_approved" => true,
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [

                    "user_id" => 1,
                    "shop_id" => null,
                    "title" => "Geistiges Eigentum",
                    "slug" => "geistiges-eigentum",
                    "description" => "Die Website und ihre ursprünglichen Inhalte, Merkmale und Funktionen sind Eigentum von [Ihrem Unternehmen] und durch internationale Urheber-, Marken- und andere Gesetze zum Schutz des geistigen Eigentums geschützt.",
                    "type" => "global",
                    "issued_by" => "Super Admin",
                    "is_approved" => true,
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [

                    "user_id" => 1,
                    "shop_id" => null,
                    "title" => "Datenschutzrichtlinie",
                    "slug" => "datenschutzrichtlinie",
                    "description" => "Ihre Nutzung der Website unterliegt außerdem unserer Datenschutzrichtlinie, die Sie unter [Link zur Datenschutzrichtlinie] finden. Durch die Nutzung der Website stimmen Sie den in der Datenschutzrichtlinie beschriebenen Praktiken zu.",
                    "type" => "global",
                    "issued_by" => "Super Admin",
                    "is_approved" => true,
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [

                    "user_id" => 1,
                    "shop_id" => null,
                    "title" => "Nutzung der Website",
                    "slug" => "nutzung-der-website",
                    "description" => "Sie müssen mindestens [Alter] Jahre alt sein, um diese Website nutzen zu können. Durch die Nutzung der Website erklären und garantieren Sie, dass Sie mindestens [Alter] Jahre alt sind. Sie erklären sich damit einverstanden, die Website nur für rechtmäßige Zwecke und in einer Weise zu nutzen, die nicht die Rechte anderer verletzt.",
                    "type" => "global",
                    "issued_by" => "Super Admin",
                    "is_approved" => true,
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
                [
                    "user_id" => 1,
                    "shop_id" => null,
                    "title" => "Annahme der Bedingungen",
                    "slug" => "annahme-der-bedingungen",
                    "description" => "Durch die Nutzung dieser Website erklären Sie sich damit einverstanden, diese Allgemeinen Geschäftsbedingungen einzuhalten und an sie gebunden zu sein. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie die Website bitte nicht.",
                    "type" => "global",
                    "issued_by" => "Super Admin",
                    "is_approved" => true,
                    "language" => "de",
                    'created_at' => Carbon::now(),
                    'updated_at' => null,
                    'deleted_at' => null,
                ],
            ];
        }
    }
}
