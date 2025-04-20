<?php


namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Marvel\Database\Models\Commission;

class CommissionRepository extends BaseRepository
{
    /**
     * Configure the Model
     **/
    public function model()
    {
        return Commission::class;
    }

    public function storeCommission($commissionItems, $language)
    {
        $this->deleteCommission($commissionItems, $language);

        foreach ($commissionItems as $key => $commissionItem) {
            $commissionExists = $this->where('id', $commissionItem['id'])->exists();

            $commissionData = [
                "level" => $commissionItem['level'],
                "sub_level" => $commissionItem['sub_level'],
                "description" => $commissionItem['description'],
                "min_balance" => $commissionItem['min_balance'],
                "max_balance" => $commissionItem['max_balance'],
                "commission" => $commissionItem['commission'],
                "image" => json_encode($commissionItem['image']),
                'language' => $language,
                "updated_at" => Carbon::now(),
            ];

            if (!$commissionExists) {
                $commissionData['created_at'] = Carbon::now();
                $this->insert($commissionData);
            } else {
                $this->where('id', $commissionItem['id'])->update($commissionData);
            }
        }
    }

    public function deleteCommission($commissionItems, $language) {
        // Get all commission IDs from the request
        $commissionIdsInRequest = array_column($commissionItems, 'id');

        // Get all commission IDs from the database for the given language
        $existingCommissionIds = $this->where('language', $language)->pluck('id')->toArray();

        // Find commissions to delete (exist in DB but not in request)
        $commissionsToDelete = array_diff($existingCommissionIds, $commissionIdsInRequest);

        // Delete commissions that need to be removed
        if (!empty($commissionsToDelete)) {
            $this->whereIn('id', $commissionsToDelete)->delete();
        }
    }


}
