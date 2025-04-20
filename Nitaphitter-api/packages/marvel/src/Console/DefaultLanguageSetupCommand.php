<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info, error};

class DefaultLanguageSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:default-language-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup default language in .env file';

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

                $targetKeys = ['DEFAULT_LANGUAGE'];
                $data = $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to setup default language?')) {

                    $default_language = text(label: 'Enter default language',default: $data[0][1], placeholder: 'E.g. en for English', required: 'Default language is required');

                    $this->defaultLanguageTable($default_language);

                    $confirmed = confirm(
                        label: "Are you sure you want to update your default language's value?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        $envContent = preg_replace(
                            "/(DEFAULT_LANGUAGE)=(.*)/",
                            "$1=$default_language",
                            $envContent
                        );

                        File::put($envFilePath, $envContent);

                        info("Congratulations! Your default language's value has been updated successfully.");
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure default language settings?', false);



                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            error($e->getMessage());
        }
    }

    private function defaultLanguageTable($default_language)
    {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['DEFAULT_LANGUAGE', $default_language],
        ]);
    }
}
