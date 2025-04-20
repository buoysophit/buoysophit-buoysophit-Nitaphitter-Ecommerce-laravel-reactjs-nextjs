<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

if (!function_exists('gateway_path')) {
    /**
     * Get the path to the base of the install.
     *
     * @param  string  $path
     * @return string
     */
    function gateway_path($path = '')
    {
        return __DIR__ . '/';
    }

    if (!function_exists('globalSlugify')) {

        /**
         * It takes a string, a model,  a key, and a divider, and returns a slugified string with a number
         * appended to it if the slug already exists in the database.
         * 
         * Here's a more detailed explanation:
         * 
         * The function takes three parameters:
         * 
         * - ``: The string to be slugified.
         * - ``: The model to check against. Model must pass as Product::class
         * - ``: The key to check The column name of the slug in the database.
         * - ``: The divider to use between the slug and the number.
         * 
         * The function first slugifies the string and then checks the database to see if the slug
         * already exists. If it doesn't, it returns the slug. If it does, it returns the slug with a
         * number appended to it.
         * 
         * Here's an example of how to use the function:
         * 
         * @param string slugText The text you want to slugify
         * @param string model The model you want to check against.
         * @param string key The column name of the slug in the database.
         * @param string divider The divider to use when appending the slug count to the slug.
         * 
         * @return string slug is being returned.
         */
        function globalSlugify(string $slugText, string $model, string $key = '', string $divider = '-', ?int $update = null): string
        {
            try {
                if ($update) {
                    $query = $model::where('id', '!=', $update);
                } else {
                    $query = $model::query();
                }
                $cleanString      = preg_replace("/[~`{}.'\"\!\@\#\$\%\^\&\*\(\)\_\=\+\/\?\>\<\,\[\]\:\;\|\\\]/", "", $slugText);
                $cleanString = preg_replace("/[\/_|+ -]+/", '-', $slugText);
                $slug = strtolower($cleanString);
                if ($key) {
                    $slugCount = $query->where($key, $slug)->count();
                } else {
                    $slugCount = $query->where('slug', $slug)->count();
                }
                $randomString = Str::random(3);

                if (empty($slugCount)) {
                    $slug = is_numeric($slug) ? "{$slug}{$divider}{$randomString}" : $slug;
                    return $slug;
                }
                return "{$slug}{$divider}{$randomString}";
            } catch (\Throwable $th) {
                throw $th;
            }
        }
    }

    if (!function_exists('server_environment_info')) {
        function server_environment_info()
        {
            return [
                "upload_max_filesize" => parseAttachmentUploadSize(ini_get('upload_max_filesize')) / 1024,
                "memory_limit" => ini_get('memory_limit'),
                "max_execution_time" => ini_get('max_execution_time'),
                "max_input_time" => ini_get('max_input_time'),
                "post_max_size" => parseAttachmentUploadSize(ini_get('post_max_size')) / 1024,
            ];
        }
    }

    if (!function_exists('parseAttachmentUploadSize')) {
        function parseAttachmentUploadSize($size)
        {
            $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
            $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
            if ($unit) {
                // Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
                return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
            } else {
                return round($size);
            }
        }
    }

    if (!function_exists('formatAPIResourcePaginate')) {
        function formatAPIResourcePaginate($data)
        {
            return response()->json([
                "data"           => $data['data'] ?? [],
                "current_page"   => $data['meta']['current_page'] ?? 0,
                "from"           => $data['meta']['from'] ?? 0,
                "to"             => $data['meta']['to'] ?? 0,
                "last_page"      => $data['meta']['last_page'] ?? 0,
                "path"           => $data['meta']['path'] ?? "",
                "per_page"       => $data['meta']['per_page'] ?? 0,
                "total"          => $data['meta']['total'] ?? 0,
                "next_page_url"  => $data['links']['next'] ?? "",
                "prev_page_url"  => $data['links']['prev'] ?? "",
                "last_page_url"  => $data['links']['last'] ?? "",
                "first_page_url" => $data['links']['first'] ?? "",
            ]);
        }
    }
    if (!function_exists('formatLicenseAPIResourcePaginate')) {
        function formatLicenseAPIResourcePaginate($data)
        {
            return [
                "data"           => $data['data'] ?? [],
                "current_page"   => $data['meta']['current_page'] ?? 0,
                "from"           => $data['meta']['from'] ?? 0,
                "to"             => $data['meta']['to'] ?? 0,
                "last_page"      => $data['meta']['last_page'] ?? 0,
                "path"           => $data['meta']['path'] ?? "",
                "per_page"       => $data['meta']['per_page'] ?? 0,
                "total"          => $data['meta']['total'] ?? 0,
                "next_page_url"  => $data['links']['next'] ?? "",
                "prev_page_url"  => $data['links']['prev'] ?? "",
                "last_page_url"  => $data['links']['last'] ?? "",
                "first_page_url" => $data['links']['first'] ?? "",
            ];
        }
    }
    if (!function_exists("Role")) {

        function Role(User $user): string
        {
            if ($user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return Permission::SUPER_ADMIN;
            } else if ($user->hasPermissionTo(Permission::STORE_OWNER) && !$user->hasPermissionTo(Permission::SUPER_ADMIN)) {
                return Permission::STORE_OWNER;
            } else if ($user->hasPermissionTo(Permission::STAFF)) {
                return Permission::STAFF;
            } else {
                return Permission::CUSTOMER;
            }
        }
    }




    if (!function_exists("getConfig")) {
        function getConfig(): array | bool
        {
            try {
                $folderPath =  storage_path('app/shop/');
                if (!File::exists($folderPath)) {
                    File::makeDirectory($folderPath, 0777, true, true);
                }
                $fileName = $folderPath . "shop.config.json";
                if (file_exists($fileName)) {
                    $json_data = file_get_contents($fileName);
                    $data = Crypt::decrypt($json_data);
                    $json_data_to_array = json_decode($data, true);
                    return $json_data_to_array;
                }
                return false;
            } catch (Exception $e) {
                return false;
            }
        }
    }

    if (!function_exists("formatCurrency")) {
        function formatCurrency(float $amount, string $currency = "USD", string $locale = "en_US")
        {
            $formatter = new NumberFormatter($locale, NumberFormatter::CURRENCY);
            return $formatter->formatCurrency($amount, $currency);
        }
    }
}
