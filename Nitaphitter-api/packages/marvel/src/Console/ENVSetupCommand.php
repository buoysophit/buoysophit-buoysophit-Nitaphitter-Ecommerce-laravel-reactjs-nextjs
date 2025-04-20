<?php

namespace Marvel\Console;


use Illuminate\Console\Command;
use function Laravel\Prompts\{info, select, table};

class ENVSetupCommand extends Command
{
    protected $signature = 'marvel:env-setup {key?}';

    protected $description = 'Setup necessary key in .env file';

    public function handle()
    {
        $optionalValue = $this->argument('key');
        if (!$optionalValue) {
            do {
                $this->info('Setup Marvel .env file');
                $this->info('Available terminal command. you can use quick access key to run specific command.');

                table(['The command looks like:'], [
                    ['php artisan marvel:env-setup mail'],
                ]);
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

               

                info('Or you can choose options');

                info('Please use arrow keys in keyboard for navigation.');

                $role = select(
                    label: 'Select a option do you want to configure in .env file?',
                    options: [
                        'mail' => 'Mail Server Setup',
                        'mail-test' => 'Mail Test',
                        'database' => 'Database',
                        'aws' => 'AWS (Amazon Web Services)',
                        'translation-enable' => 'Translation Enable',
                        'default-language' => 'Default Language',
                        'queue-connection' => 'Queue Connection',
                        'frontend-connection' => 'Frontend Connection (admin/shop)',
                        'newsletter' => 'Mailchimp Newsletter',
                        'otp' => 'OTP Message System (Twilio/MessageBird)',
                        'open-ai' => 'OpenAI',
                        'test-mail' => 'Send An Email For Credentials Check',
                        'cancel' => 'Cancel'
                    ],
                    scroll: 15
                );
                $this->commandOption($role);
            } while ($role !== 'cancel');
        } else {
            $this->commandOption($optionalValue);
        }

        $this->info('Everything is successful. Now clearing all cached...');

        $this->call('optimize:clear');

        info('Thank You.');
    }

    private function commandOption($role)
    {
        if ($role == 'mail') {
            $this->call('marvel:mail-setup');
        } elseif ($role == 'database') {
            $this->call('marvel:database-setup');
        } elseif ($role == 'mail-test') {
            $this->call('marvel:test-mail-send');
        } elseif ($role == 'aws') {
            $this->call('marvel:aws-setup');
        } elseif ($role == 'translation-enable') {
            $this->call('marvel:translation-enable');
        } elseif ($role == 'default-language') {
            $this->call('marvel:default-language-setup');
        } elseif ($role == 'queue-connection') {
            $this->call('marvel:queue-setup');
        } elseif ($role == 'frontend-connection') {
            $this->call('marvel:frontend-setup');
        } elseif ($role == 'newsletter') {
            $this->call('marvel:mailchimp-newsletter');
        } elseif ($role == 'otp') {
            $this->call('marvel:otp-gateway-setup');
        } elseif ($role == 'open-ai') {
            $this->call('marvel:open-ai-setup');
        } elseif ($role == 'test-mail') {
            $this->call('marvel:test-mail-send');
        } else {
            $role = false;
        }
    }
}
