<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{confirm, info, select, table, error};

class TranslationEnabledCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:translation-enable';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Translation Enable in .env file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if the .env file exists
        $this->CheckENVExistOrNot();
        try {
            
            $reconfigure = '';
            do { // Read the current .env content
                $envFilePath = base_path('.env');
                $envContent = File::get($envFilePath);
                $targetKeys = ['TRANSLATION_ENABLED']; // Add the keys you want to display
                $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to enable/disable translation?')) {

                    // Read the current .env content
                    $envFilePath = base_path('.env');
                    $envContent = File::get($envFilePath);

                    $role = select(
                        'enable/disable translation in .env file?',
                        ['Enable', 'Disable'],
                    );

                    $this->translationEnableTable($role);
                    $confirmed = confirm(
                        label: "Are you sure you want to update your translation settings?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        if ($role == 'Enable') {
                            $envContent = preg_replace(
                                "/(TRANSLATION_ENABLED)=(.*)/",
                                "$1=true",
                                $envContent
                            );
                        } else {
                            $envContent = preg_replace(
                                "/(TRANSLATION_ENABLED)=(.*)/",
                                "$1=false",
                                $envContent
                            );
                        }

                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your translation settings updated Successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure translation enable value settings?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function translationEnableTable($role)
    {
        info('Please, check your credentials properly');
        if ($role == 'Enable') {
            $value = 'true';
        } else {
            $value = 'false';
        }
        table(['Key', 'Value'], [
            ['TRANSLATION_ENABLED', $value],

        ]);
    }
}
