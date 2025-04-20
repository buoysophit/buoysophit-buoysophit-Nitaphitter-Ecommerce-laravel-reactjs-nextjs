<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Settings;
use function Laravel\Prompts\{text,  confirm, info};

class SettingsDataImporter extends Command
{
    private array $appData;
    protected MarvelVerification $verification;
    protected $signature = 'marvel:settings-seed';

    protected $description = 'Import Settings Data';

    public function handle()
    {
        $this->verification = new MarvelVerification();
        $shouldGetLicenseKeyFromUser = $this->shouldGetLicenseKey();
        if ($shouldGetLicenseKeyFromUser) {
            $this->getLicenseKey();
            $description = $this->appData['description'] ?? '';
            $this->components->info("Thank you for using " . APP_NOTICE_DOMAIN . ". $description");
        } else {
            $this->appData = $this->verification->jsonSerialize();
        }
        if (DB::table('settings')->where('id', 1)->exists()) {

            if (confirm('Already data exists. Do you want to refresh it with dummy settings?')) {

                info('Seeding necessary settings....');

                DB::table('settings')->truncate();

                info('Importing dummy settings...');

                $this->call('db:seed', [
                    '--class' => '\\Marvel\\Database\\Seeders\\SettingsSeeder'
                ]);

                $this->verification->modifySettingsData();
                info('Settings were imported successfully');
            } else {
                info('Previous settings was kept. Thanks!');
            }
        }
    }

    private function getLicenseKey($count = 0)
    {
        $message = 'Please Enter a valid License Key! Please visit us at https://redq.io for a valid license key.';
        if ($count < 1) {
            $message = 'Please Enter Your License Key.';
        }
        $licenseKey = text(label: $message, required: 'License Key is required');
        $isValid = $this->licenseKeyValidator($licenseKey);
        if (!$isValid) {
            ++$count;
            $description = $this->appData['description'] ?? '';
            $this->components->error("Invalid Licensing Key. $description");
            $this->getLicenseKey($count);
        }
        return $isValid;
    }

    private function licenseKeyValidator(string $licenseKey): bool
    {
        $verification = $this->verification->verify($licenseKey);
        $this->appData = $verification->jsonSerialize();
        return $verification->getTrust();
    }



    private function shouldGetLicenseKey()
    {
        $env = config("app.env");
        if ($env == "production") {
            return true;
        } elseif ($env == "local" && empty($this->verification->getTrust())) {
            return true;
        } elseif ($env == "development" && empty($this->verification->getTrust())) {
            return true;
        }
        return false;
    }
}
