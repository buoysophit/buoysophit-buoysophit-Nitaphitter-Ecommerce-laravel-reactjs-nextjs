<?php

namespace Marvel\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use function Laravel\Prompts\{info, error};





class CopyFilesCommand extends Command
{
    protected $signature = 'marvel:copy-files';

    protected $description = 'Copy necessary files';
    public function handle()
    {
        try {
            (new Filesystem)->ensureDirectoryExists(resource_path('views/emails'));

            info('Copying resources files...');

            (new Filesystem)->copyDirectory(__DIR__ . '/../../stubs/resources/views/emails', resource_path('views/emails'));
            (new Filesystem)->copyDirectory(__DIR__ . '/../../stubs/resources/views/pdf', resource_path('views/pdf'));
            (new Filesystem)->copyDirectory(__DIR__ . '/../../stubs/resources/lang', resource_path('lang'));

            info('Installation Complete');
        } catch (\Exception $e) {
            error($e->getMessage());
        }
    }
}
