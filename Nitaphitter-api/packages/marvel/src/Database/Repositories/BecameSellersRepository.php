<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\BecameSeller;

class BecameSellersRepository extends BaseRepository
{
    /**
     * Configure the Model
     **/
    public function model()
    {
        return BecameSeller::class;
    }

    // public function getApplicationSettings(): array
    // {
    //     $appData = $this->getAppSettingsData();
    //     return [
    //         'app_settings' => $appData,
    //     ];
    // }

    // private function getAppSettingsData(): array
    // {
    //     $config = new MarvelVerification();
    //     $apiData = $config->jsonSerialize();
    //     try {
    //         $licenseKey = $config->getPrivateKey();
    //         $last_checking_time = $config->getLastCheckingTime() ?? Carbon::now();
    //         $lastCheckingTimeDifferenceFromNow = Carbon::parse($last_checking_time)->diffInMinutes(Carbon::now());
    //         if ($lastCheckingTimeDifferenceFromNow > 20) {
    //             $apiData = $config->verify($licenseKey)->jsonSerialize();
    //         }
    //     } catch (Exception $e) {
    //     }
    //     return [
    //         'last_checking_time' => Carbon::now(),
    //         'trust' => $apiData['trust'] ?? false,
    //     ];
    // }
}
