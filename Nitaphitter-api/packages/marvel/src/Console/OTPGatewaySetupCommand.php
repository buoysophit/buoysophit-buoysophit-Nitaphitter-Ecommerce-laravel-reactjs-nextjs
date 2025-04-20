<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info, select};

class OTPGatewaySetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:otp-gateway-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'OTP SMS gateway setup in .env file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if the .env file exists
        $this->CheckENVExistOrNot();
        $reconfigure = '';
        $messagebird_originator = '';
        try {
            do {
                // Read the current .env content
                $envFilePath = base_path('.env');
                $envContent = File::get($envFilePath);

                // $existing_OTP_system = env('ACTIVE_OTP_GATEWAY');
                $targetKey = 'ACTIVE_OTP_GATEWAY';
                preg_match("/^$targetKey=(.*)$/m", $envContent, $matches);
                $value = $matches[1];

                if ($value == 'twilio') {
                    $targetKeys = ['ACTIVE_OTP_GATEWAY', 'TWILIO_AUTH_TOKEN', 'TWILIO_ACCOUNT_SID', 'TWILIO_VERIFICATION_SID', 'TWILIO_FROM_NUMBER']; // Add the keys you want to display
                    $twilio = $this->existingKeyValueInENV($targetKeys, $envContent);
                } else {
                    $targetKeys = ['ACTIVE_OTP_GATEWAY', 'MESSAGEBIRD_API_KEY', 'MESSAGEBIRD_ORIGINATOR']; // Add the keys you want to display
                    $data = $this->existingKeyValueInENV($targetKeys, $envContent);
                }

                info('Please use arrow keys in keyboard for navigation.');

                if (confirm('Do you want to setup OTP SMS gateway?')) {
                    $role = select(
                        'Which OTP SMS gateway you want to configure in .env file?',
                        ['twilio', 'MessageBird'],
                    );

                    if ($role == 'twilio') {
                        $targetKeys = ['ACTIVE_OTP_GATEWAY', 'TWILIO_AUTH_TOKEN', 'TWILIO_ACCOUNT_SID', 'TWILIO_VERIFICATION_SID', 'TWILIO_FROM_NUMBER']; // Add the keys you want to display
                        $twilio = $this->existingKeyValueInENV($targetKeys, $envContent);
                        $twilio_auth_token = text('Enter Twilio auth token',  default: $twilio[1][1], required: 'Twilio auth token is required');
                        $twilio_account_sid = text('Enter twilio account SID', default: $twilio[2][1], required: 'Twilio account SID is required');
                        $twilio_verification_sid = text('Enter twilio verification SID', default: $twilio[3][1], required: 'Twilio verification SID is required');
                        $twilio_from_number = text('Enter twilio from number', default: $twilio[4][1]);

                        $this->twilioTable(
                            $twilio_auth_token,
                            $twilio_account_sid,
                            $twilio_verification_sid,
                            $twilio_from_number
                        );
                    }

                    if ($role == 'MessageBird') {
                        $targetKeys = ['ACTIVE_OTP_GATEWAY', 'MESSAGEBIRD_API_KEY', 'MESSAGEBIRD_ORIGINATOR']; // Add the keys you want to display
                        $data = $this->existingKeyValueInENV($targetKeys, $envContent);
                        $messagebird_api_key = text('Enter MessageBird api key', default: $data[1][1], required: 'Port is MessageBird api key');
                        $messagebird_originator = text('Enter MessageBird originator', default: $data[2][1],);

                        $this->messagebirdTable(
                            $messagebird_api_key,
                            $messagebird_originator
                        );
                    }

                    $confirmed = confirm(
                        label: "Are you sure you want to update your OTP SMS gateway configuration?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {

                        if ($role == 'twilio') {
                            $envContent = $this->twilioDataSetup(
                                $envContent,
                                $twilio_auth_token,
                                $twilio_account_sid,
                                $twilio_verification_sid,
                                $twilio_from_number
                            );
                        }
                        if ($role == 'MessageBird') {
                            $envContent = $this->messagebirdDataSetup(
                                $envContent,
                                $messagebird_api_key,
                                $messagebird_originator
                            );
                        }

                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your OTP SMS gateway configuration updated Successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }

                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure OTP SMS gateway settings?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function twilioTable(
        $twilio_auth_token,
        $twilio_account_sid,
        $twilio_verification_sid,
        $twilio_from_number
    ) {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['ACTIVE_OTP_GATEWAY', 'twilio'],
            ['TWILIO_AUTH_TOKEN', $twilio_auth_token],
            ['TWILIO_ACCOUNT_SID', $twilio_account_sid],
            ['TWILIO_VERIFICATION_SID', $twilio_verification_sid],
            ['TWILIO_FROM_NUMBER', $twilio_from_number]
        ]);
    }
    private function messagebirdTable($messagebird_api_key, $messagebird_originator)
    {
        info('Please check your credentials carefully.');
        table(['Key', 'Value'], [
            ['ACTIVE_OTP_GATEWAY', 'messagebird'],
            ['MESSAGEBIRD_API_KEY', $messagebird_api_key],
            ['MESSAGEBIRD_ORIGINATOR', $messagebird_originator]
        ]);
    }

    // setup mailtrap's key and value in .env file
    private function twilioDataSetup(
        $envContent,
        $twilio_auth_token,
        $twilio_account_sid,
        $twilio_verification_sid,
        $twilio_from_number
    ) {
        $envContent = preg_replace("/(ACTIVE_OTP_GATEWAY)=(.*)/", "$1=twilio", $envContent);
        $envContent = preg_replace("/(TWILIO_AUTH_TOKEN)=(.*)/", "$1=$twilio_auth_token", $envContent);
        $envContent = preg_replace("/(TWILIO_ACCOUNT_SID)=(.*)/", "$1=$twilio_account_sid", $envContent);
        $envContent = preg_replace("/(TWILIO_VERIFICATION_SID)=(.*)/", "$1=$twilio_verification_sid", $envContent);
        $envContent = preg_replace("/(TWILIO_FROM_NUMBER)=(.*)/", "$1=$twilio_from_number", $envContent);
        return $envContent;
    }

    // setup mailgun's key and value in .env file
    private function messagebirdDataSetup($envContent, $messagebird_api_key, $messagebird_originator)
    {
        $envContent = preg_replace("/(ACTIVE_OTP_GATEWAY)=(.*)/", "$1=messagebird", $envContent);

        $envContent = preg_replace("/(MESSAGEBIRD_API_KEY)=(.*)/", "$1=$messagebird_api_key", $envContent);

        if ($messagebird_originator != '')
            $envContent = preg_replace("/(MESSAGEBIRD_ORIGINATOR)=(.*)/", "$1=$messagebird_originator", $envContent);
        return $envContent;
    }
}
