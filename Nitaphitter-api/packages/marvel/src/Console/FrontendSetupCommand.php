<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info, error};

class FrontendSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:frontend-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Frontend (shop and admin) URL setup';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if the .env file exists
        $this->CheckENVExistOrNot();
        $reconfigure = '';
        try {

            do {
                // Read the current .env content
                $envFilePath = base_path('.env');
                $envContent = File::get($envFilePath);

                $targetKeys = ['SHOP_URL', 'DASHBOARD_URL']; // Add the keys you want to display
                $data = $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to connect with frontend (shop and admin)?')) {
                    $shop_url = $this->shopDomain($data);
                    $admin_url = $this->adminDomain($data);

                    $this->dataTable(
                        $shop_url,
                        $admin_url
                    );
                    info('Do you want to update your shop and admin URL?');
                    info('If yes, your previous URL will be removed permanently');
                    $confirmed = confirm(
                        label: "Are you sure!",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        if ($shop_url != '') {
                            $envContent = preg_replace(
                                "/(SHOP_URL)=(.*)/",
                                "$1=$shop_url",
                                $envContent
                            );
                        }
                        if ($admin_url != '') {
                            $envContent = preg_replace(
                                "/(DASHBOARD_URL)=(.*)/",
                                "$1=$admin_url",
                                $envContent
                            );
                        }

                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your URL updated Successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }

                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconnect with frontend??', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function dataTable($shop_url, $admin_url)
    {
        if ($shop_url == null && $shop_url == '') {
            $shop_url = env('SHOP_URL');
        }
        if ($admin_url == null && $admin_url == '') {
            $admin_url = env('DASHBOARD_URL');
        }
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['SHOP_URL',  $shop_url],
            ['DASHBOARD_URL', $admin_url],
        ]);
    }

    private function previousData($envContent)
    {
        $targetKeys = ['SHOP_URL', 'DASHBOARD_URL']; // Add the keys you want to display
        $keyValuePairs = [];

        foreach ($targetKeys as $targetKey) {
            // Search for the key in the content
            preg_match("/^$targetKey=(.*)$/m", $envContent, $matches);

            // Check if the key was found
            if (isset($matches[1])) {
                $value = $matches[1];
                $keyValuePairs[] = [$targetKey, $value];
            } else {
                $keyValuePairs[] = [$targetKey, 'Not found'];
            }
        }
        // Display the key-value pairs in a table
        if (!empty($keyValuePairs)) {
            info('Your existing frontend URL key & value on the .env file right now:');
            table(['Key', 'Value'], $keyValuePairs);
        } else {
            error('No key-value pairs found in the .env file');
        }
    }

    private function shopDomain($data)
    {
        $shop_url = '';
        $shopUrl = $data[0][1];

        if ($shopUrl !== null && $shopUrl !== '') {
            info('Your existing shop URL key & value on the .env file right now:');
            table(['Key', 'Value'], [['SHOP_URL', $shopUrl]]);
            info('You can upgrade shop URL or skip it.');
            do {
                $shop_url = text(label: 'Enter shop URL', default: $shopUrl, placeholder: 'E.g. http://domain.com');
                if ($shop_url !== '' && !filter_var($shop_url, FILTER_VALIDATE_URL)) {
                    $this->error('Invalid URL format. Please enter a valid URL.');
                } else {
                    break;
                }
            } while (true);
        } else {
            info('Your existing shop URL key & value on the .env file right now:');
            table(['Key', 'Value'], [['SHOP_URL', $shopUrl]]);
            do {

                $shop_url = text(label: 'Enter SHOP_URL', placeholder: 'E.g. http://domain.com', required: 'SHOP_URL is required');
                if ($shop_url !== '' && !filter_var($shop_url, FILTER_VALIDATE_URL)) {
                    $this->error('Invalid URL format. Please enter a valid URL.');
                } else {
                    break;
                }
            } while (true);
        }
        return $shop_url;
    }

    private function adminDomain($data)
    {
        $admin_url = '';
        $adminUrl = $data[1][1];
        if ($adminUrl !== null && $adminUrl !== '') {
            info('Your existing dashboard URL key & value on the .env file right now:');
            table(['Key', 'Value'], [['DASHBOARD_URL', $adminUrl]]);
            info('You can upgrade dashboard URL or skip it.');
            do {
                $admin_url = text(label: 'Enter dashboard URL', default: $adminUrl, placeholder: 'E.g. http://domain.com');
                if ($admin_url !== '' && !filter_var($admin_url, FILTER_VALIDATE_URL)) {
                    $this->error('Invalid URL format. Please enter a valid URL.');
                } else {
                    break;
                }
            } while (true);
        } else {
            info('Your existing dashboard URL key & value on the .env file right now:');
            table(['Key', 'Value'], [['DASHBOARD_URL', $adminUrl]]);
            do {

                $admin_url = text(label: 'Enter DASHBOARD_URL', placeholder: 'E.g. http://domain.com', required: 'SHOP_URL is required');
                if ($admin_url !== '' && !filter_var($admin_url, FILTER_VALIDATE_URL)) {
                    $this->error('Invalid URL format. Please enter a valid URL.');
                } else {
                    break;
                }
            } while (true);
        }
        return $admin_url;
    }
}
