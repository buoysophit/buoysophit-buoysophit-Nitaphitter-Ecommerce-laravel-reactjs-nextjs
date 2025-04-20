<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Marvel\Traits\ENVSetupTrait;

use function Laravel\Prompts\{text, table, confirm, info};

class QueueConnectionSetupCommand extends Command
{
    use ENVSetupTrait;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'marvel:queue-setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup queue connection in .env file';

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
                $targetKeys = ['QUEUE_CONNECTION']; // Add the keys you want to display
                $data = $this->existingKeyValueInENV($targetKeys, $envContent);

                info('Please use arrow keys in keyboard for navigation.');

                if (confirm('Do you want to setup queue connection?')) {
                    $queue_connection = text(label: 'Enter queue connection value',default: $data[0][1],  placeholder: 'E.g. database / sync', required: 'Queue connection value is required');

                    $this->queueConnectionTable($queue_connection);

                    $confirmed = confirm(
                        label: "Are you sure you want to update your queue connection?",
                        default: true,
                        yes: 'Yes, I accept',
                        no: 'No, I decline',
                        hint: 'The terms must be accepted to continue.'
                    );

                    if ($confirmed) {
                        $envContent = preg_replace(
                            "/(QUEUE_CONNECTION)=(.*)/",
                            "$1=$queue_connection",
                            $envContent
                        );

                        File::put($envFilePath, $envContent);
                        info('Congratulations! Your queue connection updated Successfully!');
                    } else {
                        info('Your previous data (if any) is kept.');
                    }
                }
                info('If you think there is something wrong in the config, then you can reconfigure it.');
                $reconfigure = confirm('Do you want to reconfigure URL settings?', false);

                // If the user wants to reconfigure, the loop will continue
            } while ($reconfigure);
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }
    }

    private function queueConnectionTable($queue_connection)
    {
        info('Please, check your credentials properly');
        table(['Key', 'Value'], [
            ['QUEUE_CONNECTION', $queue_connection],
        ]);
    }
}
