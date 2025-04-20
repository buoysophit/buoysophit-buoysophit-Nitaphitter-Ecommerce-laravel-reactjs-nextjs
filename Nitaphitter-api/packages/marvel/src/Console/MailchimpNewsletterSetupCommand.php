<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info};

class MailchimpNewsletterSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:mailchimp-newsletter';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mailchimp newsletter setup in .env file';

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
                $targetKeys = ['NEWSLETTER_API_KEY', 'NEWSLETTER_LIST_ID']; // Add the keys you want to display
                $data =  $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to setup mailchimp newsletter?')) {
                    $newsletter_api_key = text('Enter newsletter api key',  default: $data[0][1], required: 'Newsletter api key is required');
                    $newsletter_list_id = text('Enter newsletter list ID', default: $data[1][1], required: 'newsletter list ID required');

                    $this->newsletterTable(
                        $newsletter_api_key,
                        $newsletter_list_id
                    );

                    $confirmed = confirm(
                        label: "Are you sure you want to update your Mailchimp newsletter configuration?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {

                        $envContent = $this->newsletterDataSetup(
                            $envContent,
                            $newsletter_api_key,
                            $newsletter_list_id
                        );


                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your mailchimp newsletter configuration updated Successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure mailchimp newsletter settings?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function newsletterTable(
        $newsletter_api_key,
        $newsletter_list_id
    ) {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['NEWSLETTER_API_KEY', $newsletter_api_key],
            ['NEWSLETTER_LIST_ID', $newsletter_list_id]
        ]);
    }

    private function newsletterDataSetup(
        $envContent,
        $newsletter_api_key,
        $newsletter_list_id
    ) {
        $envContent = preg_replace("/(NEWSLETTER_API_KEY)=(.*)/", "$1=$newsletter_api_key", $envContent);
        $envContent = preg_replace("/(NEWSLETTER_LIST_ID)=(.*)/", "$1=$newsletter_list_id", $envContent);
        return $envContent;
    }
}
