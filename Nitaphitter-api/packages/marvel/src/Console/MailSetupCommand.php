<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use function Laravel\Prompts\{text, table, confirm, info, select, password, validate, number};
use Symfony\Component\HttpKernel\Exception\HttpException;
use Exception;
use Illuminate\Support\Facades\Mail;

class MailSetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:mail-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mail setup';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $reconfigure = '';
        try {
            do {
                // Read the current .env content
                $envFilePath = base_path('.env');
                $envContent = File::get($envFilePath);

                $data = $this->checkExistingConfig($envContent);


                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to setup your mail server?')) {

                    info("We provide 'mailtrap', 'mailgun' & 'gmail' config by command line.");
                    info("If you want to setup any other mail service, then you need to setup manually.");

                    $role = select(
                        'Which mail server do you want to configure in .env file?',
                        ['mailtrap', 'mailgun', 'gmail'],
                    );

                    $mail_host = text(label: 'Enter mail host', default: $data[1][1], required: 'Mail host is required');
                    $number = null;
                    do {
                        $mail_port = text('Enter port', default: $data[2][1], required: 'Port is required');

                        // Validate if the input is a number
                        if (!is_numeric($mail_port)) {
                            info('Invalid input. Please enter an integer as a port.');
                        } else {
                            $number = $mail_port;
                        }
                    } while ($number === null);
                    // $mail_port = number(label: 'Enter port', required: 'Port is required');
                    $mail_username = text(label: 'Enter username', default: $data[3][1], required: 'Username is required');
                    $mail_password = text(label: 'Enter password', default: $data[4][1],required: 'Password is required');
                    $mail_from_address = text('Enter mail from address', default: $data[5][1],);

                    // Manually validate the email input
                    do {
                        $admin_email = text('Enter Admin Email', default: $data[6][1]);
                        if (!filter_var($admin_email, FILTER_VALIDATE_EMAIL)) {
                            info('Invalid email address format. Please enter a valid email.');
                        } else {
                            // Break out of the loop if the email is valid
                            break;
                        }
                    } while (true);

                    if ($role == 'mailtrap') {
                        $this->mailtrapTable(
                            $mail_port,
                            $mail_host,
                            $mail_username,
                            $mail_password,
                            $mail_from_address,
                            $admin_email

                        );
                    }

                    if ($role == 'mailgun') {
                        $mailgun_domain = text('Enter mailgun domain', default: $data[7][1] ?? '',);
                        $mailgun_secret = text('Enter mailgun secret key', default: $data[8][1] ?? '');

                        $this->mailgunTable(
                            $mail_port,
                            $mail_host,
                            $mail_username,
                            $mail_password,
                            $mailgun_domain,
                            $mailgun_secret,
                            $mail_from_address,
                            $admin_email
                        );
                    }

                    if ($role == 'gmail') {
                        $this->gmailTable(
                            $mail_port,
                            $mail_host,
                            $mail_username,
                            $mail_password,
                            $mail_from_address,
                            $admin_email
                        );
                    }

                    info('Do you want to update your mail server configuration?');
                    info('If yes, your previous mail server configuration will be removed permanently.');
                    $confirmed = confirm(
                        label: "Are you sure!",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        $envContent = $this->remove_existing_env_key($envContent);

                        // setup mailtrap's key and value in .env file
                        if ($role == 'mailtrap') {
                            $envContent = $this->mailtrapDataSetup(
                                $envContent,
                                $mail_port,
                                $mail_host,
                                $mail_username,
                                $mail_password,
                                $mail_from_address,
                                $admin_email
                            );
                        }
                        // setup mailgun's key and value in .env file
                        if ($role == 'mailgun') {
                            $envContent = $this->mailgunDataSetup(
                                $envContent,
                                $mail_port,
                                $mail_host,
                                $mail_username,
                                $mail_password,
                                $mailgun_domain,
                                $mailgun_secret,
                                $mail_from_address,
                                $admin_email
                            );
                        }

                        // setup gmail's key and value in .env file
                        if ($role == 'gmail') {
                            $envContent = $this->gmailDataSetup(
                                $envContent,
                                $mail_port,
                                $mail_host,
                                $mail_username,
                                $mail_password,
                                $mail_from_address,
                                $admin_email
                            );
                        }

                        File::put($envFilePath, $envContent);

                        info('Congratulations! Your mail server configuration updated successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure mail settings?', false);


                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
            info('If you want to test your mail configuration, then you can run this command');
            table(['Command', 'Details'], [['marvel:test-mail-send', 'It will send a test mail']]);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function mailtrapTable($mail_port, $mail_host, $mail_username, $mail_password, $mail_from_address, $admin_email)
    {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['MAIL_MAILER', 'smtp'],
            ['MAIL_HOST', $mail_host],
            ['MAIL_PORT', $mail_port],
            ['MAIL_USERNAME', $mail_username],
            ['MAIL_PASSWORD', $mail_password],
            ['MAIL_FROM_ADDRESS', $mail_from_address],
            ['ADMIN_EMAIL', $admin_email]

        ]);
    }
    private function mailgunTable(
        $mail_port,
        $mail_host,
        $mail_username,
        $mail_password,
        $mailgun_domain,
        $mailgun_secret,
        $mail_from_address,
        $admin_email
    ) {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['MAIL_MAILER', 'mailgun'],
            ['MAIL_HOST', $mail_host],
            ['MAIL_PORT', $mail_port],
            ['MAIL_USERNAME', $mail_username],
            ['MAIL_PASSWORD', $mail_password],
            ['MAIL_FROM_ADDRESS', $mail_from_address],
            ['ADMIN_EMAIL', $admin_email],
            ['MAILGUN_DOMAIN', $mailgun_domain],
            ['MAILGUN_SECRET', $mailgun_secret],
            ['MAIL_ENCRYPTION', 'tls'],
        ]);
    }
    private function gmailTable($mail_port, $mail_host, $mail_username, $mail_password, $mail_from_address, $admin_email)
    {
        info('Please check your credentials carefully.');
        table(['Key', 'Value'], [
            ['MAIL_MAILER', 'smtp'],
            ['MAIL_HOST', $mail_host],
            ['MAIL_PORT', $mail_port],
            ['MAIL_USERNAME', $mail_username],
            ['MAIL_PASSWORD', $mail_password],
            ['MAIL_FROM_ADDRESS', $mail_from_address],
            ['ADMIN_EMAIL', $admin_email]
        ]);
    }

    // setup mailtrap's key and value in .env file
    private function mailtrapDataSetup($envContent, $mail_port, $mail_host, $mail_username, $mail_password, $mail_from_address, $admin_email)
    {
        $key = "# Email";
        $data = [
            "MAIL_MAILER=smtp ",
            "MAIL_HOST={$mail_host}",
            "MAIL_PORT={$mail_port}",
            "MAIL_USERNAME={$mail_username}",
            "MAIL_PASSWORD={$mail_password}",
            "MAIL_FROM_ADDRESS={$mail_from_address}",
            "ADMIN_EMAIL={$admin_email}",
        ];
        $envContent = $this->insertDataAfterKey($envContent, $key, $data);
        return $envContent;
    }

    // setup mailgun's key and value in .env file
    private function mailgunDataSetup($envContent, $mail_port, $mail_host, $mail_username, $mail_password, $mailgun_domain, $mailgun_secret, $mail_from_address, $admin_email)
    {
        $key = "# Email";
        $data = [
            "MAIL_MAILER=mailgun ",
            "MAIL_HOST={$mail_host}",
            "MAIL_PORT={$mail_port}",
            "MAIL_USERNAME={$mail_username}",
            "MAIL_PASSWORD={$mail_password}",
            "MAILGUN_DOMAIN={$mailgun_domain}",
            "MAILGUN_SECRET={$mailgun_secret}",
            "MAIL_FROM_ADDRESS={$mail_from_address}",
            "MAIL_ENCRYPTION=tls",
            "ADMIN_EMAIL={$admin_email}",
        ];
        $envContent = $this->insertDataAfterKey($envContent, $key, $data);
        return $envContent;
    }
    // setup gmail's key and value in .env file
    private function gmailDataSetup($envContent, $mail_port, $mail_host, $mail_username, $mail_password, $admin_email, $mail_from_address)
    {
        $key = "# Email";
        $data = [
            "MAIL_MAILER=smtp",
            "MAIL_HOST={$mail_host}",
            "MAIL_PORT={$mail_port}",
            "MAIL_USERNAME={$mail_username}",
            "MAIL_PASSWORD={$mail_password}",
            "MAIL_ENCRYPTION=tls",
            "MAIL_FROM_ADDRESS={$mail_from_address}",
            "ADMIN_EMAIL={$admin_email}",
        ];
        $envContent = $this->insertDataAfterKey($envContent, $key, $data);
        return $envContent;
    }

    private function remove_existing_env_key($envContent)
    {
        $keysToRemove = [
            'MAIL_MAILER',
            'MAIL_HOST',
            'MAIL_PORT',
            'MAIL_USERNAME',
            'MAIL_PASSWORD',
            'MAILGUN_DOMAIN',
            'MAILGUN_SECRET',
            'MAIL_FROM_ADDRESS',
            'MAIL_ENCRYPTION',
            'ADMIN_EMAIL',
        ];

        foreach ($keysToRemove as $key) {
            $envContent = preg_replace("/^\s*$key\s*=\s*.*$/m", '', $envContent);
        }
        return $envContent;
    }
    private function insertDataAfterKey($envContent, $key, $data)
    {
        // Split the content into lines
        $lines = explode("\n", $envContent);

        // Find the position of the key
        $position = false;
        foreach ($lines as $index => $line) {
            // Check for the key, considering both commented and uncommented keys
            if (strpos($line, $key) !== false) {
                $position = $index;
                break;
            }
        }

        // If the key is found, insert data after it
        if ($position !== false) {
            // Check if the next line is empty, and remove it if necessary
            if (isset($lines[$position + 1]) && empty(trim($lines[$position + 1]))) {
                unset($lines[$position + 1]);
            }

            // Insert the new data
            array_splice($lines, $position + 1, 0, $data);
        } else {
            // Key not found, insert data at the end
            $lines = array_merge($lines, $data);
        }

        // Trim each line to remove leading and trailing whitespace
        $lines = array_map('trim', $lines);

        // Rebuild the content and remove extra newline characters
        $envContent = implode("\n", $lines);
        $envContent = preg_replace("/^\n+/", '', $envContent);

        return $envContent;
    }

    protected function sendEmail()
    {
        $to = 'recipient@example.com';
        $subject = 'Mail Configuration Completed';
        $message = 'Your mail configuration has been successfully completed.';

        Mail::raw($message, function ($mail) use ($to, $subject) {
            $mail->to($to)->subject($subject);
        });
    }
    protected function checkExistingConfig($envContent)
    {
        $targetKeys = [
            "MAIL_MAILER",
            "MAIL_HOST",
            "MAIL_PORT",
            "MAIL_USERNAME",
            "MAIL_PASSWORD",
            "MAIL_FROM_ADDRESS",
            "ADMIN_EMAIL",
            "MAILGUN_DOMAIN",
            "MAILGUN_SECRET",
            "MAIL_ENCRYPTION",
        ]; // Add the keys you want to display

        $keyValuePairs = [];
        foreach ($targetKeys as $targetKey) {
            // Search for the key in the content
            preg_match("/^$targetKey=(.*)$/m", $envContent, $matches);

            // Check if the key was found
            if (isset($matches[1])) {
                $value = $matches[1];
                if ($value !== null) {
                    $keyValuePairs[] = [$targetKey, $value];
                }
            }
        }

        // Display the key-value pairs in a table
        if (!empty($keyValuePairs)) {
            info('Your existing key & value on the .env file right now:');
            table(['Key', 'Value'], $keyValuePairs);
        } else {
            $this->error('No key-value pairs found in the .env file');
        }
        return $keyValuePairs;
    }
}
