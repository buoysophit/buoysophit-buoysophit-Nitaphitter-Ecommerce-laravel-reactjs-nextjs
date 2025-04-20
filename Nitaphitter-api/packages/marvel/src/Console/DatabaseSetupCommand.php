<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info, password};

class DatabaseSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:database-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup MySQL database in .env file';

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

                $targetKeys = ['DB_CONNECTION', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD']; // Add the keys you want to display
                $data = $this->existingKeyValueInENV($targetKeys, $envContent);


                info('Please use arrow keys in keyboard for navigation.');
                if (confirm('Do you want to setup MySQL database?')) {
                   $db_host = text(label: 'Enter Database Host Name',default: $data[1][1], required: 'Database host name is required', placeholder: 'E.g. mysql/localhost');
                    $number = null;
                    do {
                        $db_port = text(label: 'Enter Database Port', default: $data[2][1],required: 'Database port is required', placeholder: 'E.g. 3306');

                        // Validate if the input is a number
                        if (!is_numeric($db_port)) {
                            info('Invalid input. Please enter an integer as a port.');
                        } else {
                            $number = $db_port;
                        }
                    } while ($number === null);
                    $db_database = text(label: 'Enter Database Name', default: $data[3][1],required: 'Database name is required');
                    $db_username = text(label: 'Enter Database User Name', default: $data[4][1],required: 'Database user name is required');
                    $db_password = text(label: 'Enter Database Password', default: $data[5][1], required: 'Database password is required');

                    $this->databaseTable(
                        // $db_connection,
                        $db_host,
                        $db_port,
                        $db_database,
                        $db_username,
                        $db_password,
                    );

                    $confirmed = confirm(
                        label: "Are you sure you want to update your database connection?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        $envContent = $this->databaseSetup(
                            $envContent,
                            // $db_connection,
                            $db_host,
                            $db_port,
                            $db_database,
                            $db_username,
                            $db_password,
                        );

                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your database connection updated successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure database setup?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function databaseTable(
        // $db_connection,
        $db_host,
        $db_port,
        $db_database,
        $db_username,
        $db_password,
    ) {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['DB_CONNECTION', 'mysql'],
            ['DB_HOST', $db_host],
            ['DB_PORT', $db_port],
            ['DB_DATABASE', $db_database],
            ['DB_USERNAME', $db_username],
            ['DB_PASSWORD', $db_password],

        ]);
    }

    // setup database key and value in .env file
    private function databaseSetup(
        $envContent,
        // $db_connection,
        $db_host,
        $db_port,
        $db_database,
        $db_username,
        $db_password,
    ) {
        // $envContent = preg_replace(
        //     "/(DB_CONNECTION)=(.*)/",
        //     "$1=$db_connection",
        //     $envContent
        // );
        $envContent = preg_replace(
            "/(DB_HOST)=(.*)/",
            "$1=$db_host",
            $envContent
        );
        $envContent = preg_replace(
            "/(DB_PORT)=(.*)/",
            "$1=$db_port",
            $envContent
        );
        $envContent = preg_replace(
            "/(DB_DATABASE)=(.*)/",
            "$1=$db_database",
            $envContent
        );
        $envContent = preg_replace(
            "/(DB_USERNAME)=(.*)/",
            "$1=$db_username",
            $envContent
        );
        $envContent = preg_replace(
            "/(DB_PASSWORD)=(.*)/",
            "$1=$db_password",
            $envContent
        );
        return $envContent;
    }
}
