<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info};

class MarvelInfoCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:help';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Marvel command information';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if the .env file exists
        $this->CheckENVExistOrNot();
        try {
                // Read the current .env content
                $envFilePath = base_path('.env');
                $envContent = File::get($envFilePath);
                $targetKeys = ['APP_NAME','APP_ENV','APP_DEBUG','APP_URL','APP_VERSION','APP_SERVICE','APP_NOTICE_DOMAIN','DUMMY_DATA_PATH']; // Add the keys you want to display
                info('Basic application information.');
                $this->existingKeyValueInENV($targetKeys, $envContent);


                info('Available Marvel Command');

                table(['Command', 'Details'], [
                    ['marvel:install', 'Installing Marvel application'],
                    ['marvel:env-setup', 'Setup necessary config in .env file'],
                    ['marvel:database-setup', 'Setup MySQL database in .env file'],
                    ['marvel:mail-setup', 'Mail server setup (mailtrap, mailgun, gmail)'],
                    ['marvel:mailchimp-newsletter', 'Mailchimp newsletter setup in .env file'],
                    ['marvel:frontend-setup', 'Frontend URL setup (admin & shop)'],
                    ['marvel:aws-setup', 'AWS (bucket) setup'],
                    ['marvel:create-admin', 'Create an admin user'],
                    ['marvel:default-language-setup', 'Setup default language in .env file'],
                    ['marvel:open-ai-setup', 'Setup OpenAI in .env file'],
                    ['marvel:otp-gateway-setup', 'OTP SMS gateway (Twilio or MessageBird) setup in .env file'],
                    ['marvel:queue-setup', 'Setup queue connection in .env file. (e.g. database or sync)'],
                    ['marvel:seed', 'Import Demo Data'],
                    ['marvel:settings-seed', 'Import Settings Data'],
                    ['marvel:translation-enable', 'Enable translation settings in .env file (true/false)'],
                    ['marvel:test-mail-send', 'Send an email for credentials check'],
                ]);

                $this->info("'marvel:env-setup' command has some Quick Access Key");

                table(['Quick Access Key', 'Details'], [
                    ['mail', 'Mail server setup (mailtrap, mailgun, gmail)'],
                    ['database', 'Setup MySQL database in .env file'],
                    ['newsletter', 'Mailchimp newsletter setup in .env file'],
                    ['frontend-connection', 'Frontend URL setup (admin & shop)'],
                    ['aws', 'AWS (bucket) setup'],
                    ['default-language', 'Setup default language in .env file'],
                    ['open-ai', 'Setup OpenAI in .env file'],
                    ['otp', 'OTP SMS gateway (Twilio or MessageBird) setup in .env file'],
                    ['queue-connection', 'Setup queue connection in .env file. (e.g. database or sync)'],
                    ['translation-enable', 'Enable translation settings in .env file (true/false)'],
                    ['test-mail', 'Send an email for credentials check'],
                ]);


                table(['The command looks like:'], [
                    ['marvel:env-setup mail'],
                ]);

        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }
}
