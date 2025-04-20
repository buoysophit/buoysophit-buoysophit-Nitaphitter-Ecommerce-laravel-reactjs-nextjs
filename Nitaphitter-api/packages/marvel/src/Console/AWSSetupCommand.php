<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info, error};

class AWSSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:aws-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'AWS setup';

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
                $targetKeys = ['MEDIA_DISK', 'FILESYSTEM_DISK', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION', 'AWS_BUCKET']; // Add the keys you want to display

                $data = $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to setup AWS config?')) {
                    $media_disk = text(label: 'Enter media disk', default: $data[0][1]);
                    $filesystem_disk = text(label: 'Enter filesystem disk', default: $data[1][1]);
                    $aws_access_key_id = text(label: 'Enter AWS access key ID', default: $data[2][1],  required: 'AWS access key ID is required');
                    $aws_secret_access_key = text(label: 'Enter AWS secret key', default: $data[3][1], required: 'AWS secret key is required');
                    $aws_default_region = text(label: 'Enter AWS default region', default: $data[4][1], required: 'AWS default region is required');
                    $aws_bucket = text(label: 'Enter AWS bucket', default: $data[5][1], required: 'Bucket is required');

                    $this->awsTable(
                        $media_disk,
                        $filesystem_disk,
                        $aws_access_key_id,
                        $aws_secret_access_key,
                        $aws_default_region,
                        $aws_bucket,
                    );
                    info('Do you want to update your AWS configuration?');
                    info('If yes, your previous AWS configuration will be removed permanently');
                    $confirmed = confirm(
                        label: "Are you sure!",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        $envContent = $this->awsDataSetup(
                            $envContent,
                            $media_disk,
                            $filesystem_disk,
                            $aws_access_key_id,
                            $aws_secret_access_key,
                            $aws_default_region,
                            $aws_bucket,
                        );
                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your AWS configuration is updated successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure AWS settings?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function awsTable(
        $media_disk,
        $filesystem_disk,
        $aws_access_key_id,
        $aws_secret_access_key,
        $aws_default_region,
        $aws_bucket
    ) {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['MEDIA_DISK', $media_disk],
            ['FILESYSTEM_DISK', $filesystem_disk],
            ['AWS_ACCESS_KEY_ID', $aws_access_key_id],
            ['AWS_SECRET_ACCESS_KEY', $aws_secret_access_key],
            ['AWS_DEFAULT_REGION', $aws_default_region],
            ['AWS_BUCKET', $aws_bucket],

        ]);
    }

    // setup mailtrap's key and value in .env file
    private function awsDataSetup(
        $envContent,
        $media_disk,
        $filesystem_disk,
        $aws_access_key_id,
        $aws_secret_access_key,
        $aws_default_region,
        $aws_bucket
    ) {
        $envContent = preg_replace(
            "/(MEDIA_DISK)=(.*)/",
            "$1=$media_disk",
            $envContent
        );
        $envContent = preg_replace(
            "/(FILESYSTEM_DISK)=(.*)/",
            "$1=$filesystem_disk",
            $envContent
        );
        $envContent = preg_replace(
            "/(AWS_ACCESS_KEY_ID)=(.*)/",
            "$1=$aws_access_key_id",
            $envContent
        );
        $envContent = preg_replace(
            "/(AWS_SECRET_ACCESS_KEY)=(.*)/",
            "$1=$aws_secret_access_key",
            $envContent
        );
        $envContent = preg_replace(
            "/(AWS_DEFAULT_REGION)=(.*)/",
            "$1=$aws_default_region",
            $envContent
        );
        $envContent = preg_replace(
            "/(AWS_BUCKET)=(.*)/",
            "$1=$aws_bucket",
            $envContent
        );
        return $envContent;
    }
}
