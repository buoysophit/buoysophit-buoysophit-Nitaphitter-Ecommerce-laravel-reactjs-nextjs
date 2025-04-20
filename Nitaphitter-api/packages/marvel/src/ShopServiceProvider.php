<?php

namespace Marvel;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Marvel\Console\MarvelVerification;
use Marvel\Http\Middleware\EnsureEmailIsVerified;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\Schema\Types\LaravelEnumType;
use Marvel\Enums\CouponType;
use Marvel\Enums\ShippingType;
use Marvel\Enums\Permission;
use Marvel\Providers\GraphQLServiceProvider;
use Marvel\Providers\RestApiServiceProvider;
use Marvel\Providers\EventServiceProvider;
use Marvel\Console\InstallCommand;
use Illuminate\Support\Facades\App;
use Nuwave\Lighthouse\WhereConditions\WhereConditionsServiceProvider;
use Illuminate\Support\Facades\Gate;
use Marvel\Ai\Ai;
use Marvel\Console\AdminCreateCommand;
use Marvel\Console\AWSSetupCommand;
use Marvel\Console\CopyFilesCommand;
use Marvel\Console\DatabaseSetupCommand;
use Marvel\Console\DefaultLanguageSetupCommand;
use Marvel\Console\ENVSetupCommand;
use Marvel\Console\FrontendSetupCommand;
use Marvel\Console\ImportDemoData;
use Marvel\Console\MailchimpNewsletterSetupCommand;
use Marvel\Console\MailSetupCommand;
use Marvel\Console\MarvelInfoCommand;
use Marvel\Console\OpenAiSetupCommand;
use Marvel\Console\OTPGatewaySetupCommand;
use Marvel\Console\QueueConnectionSetupCommand;
use Marvel\Console\SettingsDataImporter;
use Marvel\Console\TestMailSendCommand;
use Marvel\Console\TranslationEnabledCommand;
use Marvel\Database\Models\Settings;
use Marvel\Enums\EventType;
use Marvel\Enums\ManufacturerType;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\ProductType;
use Marvel\Enums\RefundStatus;
use Marvel\Enums\WithdrawStatus;
use Marvel\Enums\PaymentGatewayType;
use Marvel\Enums\PaymentStatus;
use Marvel\Enums\ProductStatus;
use Marvel\Enums\RefundPolicyStatus;
use Marvel\Enums\RefundPolicyTarget;
use Marvel\Enums\Role;
use Marvel\Payments\Payment;
use Marvel\Enums\StoreNoticePriority;
use Marvel\Enums\StoreNoticeType;
use Marvel\Http\Resources\Resource;
use Marvel\Providers\MarvelBroadcastServiceProvider;

class ShopServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $serviceProviders = [
        GraphQLServiceProvider::class,
        RestApiServiceProvider::class,
        EventServiceProvider::class,
        WhereConditionsServiceProvider::class,
        MarvelBroadcastServiceProvider::class,
        // Maatwebsite\Excel\ExcelServiceProvider::class,

    ];

    /**
     * @var array
     */
    protected $enums = [
        CouponType::class,
        Permission::class,
        StoreNoticeType::class,
        StoreNoticePriority::class,
        ShippingType::class,
        ProductType::class,
        WithdrawStatus::class,
        RefundStatus::class,
        PaymentGatewayType::class,
        ManufacturerType::class,
        OrderStatus::class,
        PaymentStatus::class,
        ProductStatus::class,
        EventType::class,
        Role::class,
        RefundPolicyStatus::class,
        RefundPolicyTarget::class,
    ];

    protected $commandList = [
        InstallCommand::class,
        AdminCreateCommand::class,
        ImportDemoData::class,
        CopyFilesCommand::class,
        SettingsDataImporter::class,
        MailSetupCommand::class,
        AWSSetupCommand::class,
        FrontendSetupCommand::class,
        TranslationEnabledCommand::class,
        DefaultLanguageSetupCommand::class,
        QueueConnectionSetupCommand::class,
        OTPGatewaySetupCommand::class,
        MailchimpNewsletterSetupCommand::class,
        ENVSetupCommand::class,
        OpenAiSetupCommand::class,
        DatabaseSetupCommand::class,
        MarvelInfoCommand::class,
        TestMailSendCommand::class,
    ];

    /**
     * @var string[]
     */
    protected $routeMiddleware = [
        'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        'email.verified' => EnsureEmailIsVerified::class,
    ];


    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot(TypeRegistry $typeRegistry): void
    {
        $this->loadServiceProviders();
        $this->loadMiddleware();
        $this->bootConsole();
        $this->registerEnum($typeRegistry);
        $this->givePermissionToSuperAdmin();
        $this->loadMigrations();
        $this->loadHelpers();
        Resource::withoutWrapping();
    }

    public function loadMigrations()
    {
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
        // $this->loadFactoriesFrom(__DIR__ . '/../database/factories');
    }

    /**
     * If the helper file exists, require it.
     */
    public function loadHelpers()
    {
        if (File::exists(__DIR__ . '/Helpers/helpers.php')) {
            require(__DIR__ . '/Helpers/helpers.php');
        }
        if (File::exists(__DIR__ . '/Helpers/ResourceHelpers.php')) {
            require(__DIR__ . '/Helpers/ResourceHelpers.php');
        }
    }

    /**
     * Load Service Providers
     *
     * @return void
     */
    public function loadServiceProviders(): void
    {
        foreach ($this->serviceProviders as $provider) {
            App::register($provider);
        }
    }

    public function givePermissionToSuperAdmin()
    {
        Gate::before(function ($user, $ability) {
            return $user->hasPermissionTo(Permission::SUPER_ADMIN) ? true : null;
        });
    }

    public function registerEnum($typeRegistry)
    {
        foreach ($this->enums as $enum) {
            $typeRegistry->register(
                new LaravelEnumType($enum)
            );
        }
    }

    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function bootConsole()
    {
        // Publishing is only necessary when using the CLI.
        if ($this->app->runningInConsole()) {
            $this->bootForConsole();
        }
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register(): void
    {

        $this->mergeConfigFrom(__DIR__ . '/../config/shop.php', 'shop');

        config([
            'auth'               => File::getRequire(__DIR__ . '/../config/auth.php'),
            'cors'               => File::getRequire(__DIR__ . '/../config/cors.php'),
            'cache'              => File::getRequire(__DIR__ . '/../config/cache.php'),
            'graphql-playground' => File::getRequire(__DIR__ . '/../config/graphql-playground.php'),
            'laravel-omnipay'    => File::getRequire(__DIR__ . '/../config/laravel-omnipay.php'),
            'media-library'      => File::getRequire(__DIR__ . '/../config/media-library.php'),
            'permission'         => File::getRequire(__DIR__ . '/../config/permission.php'),
            'sanctum'            => File::getRequire(__DIR__ . '/../config/sanctum.php'),
            'services'           => File::getRequire(__DIR__ . '/../config/services.php'),
            'scout'              => File::getRequire(__DIR__ . '/../config/scout.php'),
            'sluggable'          => File::getRequire(__DIR__ . '/../config/sluggable.php'),
            'constants'          => File::getRequire(__DIR__ . '/../config/constants.php'),
            'newsletter'         => File::getRequire(__DIR__ . '/../config/newsletter.php'),
            'paystack'           => File::getRequire(__DIR__ . '/../config/paystack.php'),
            'graphiql'           => File::getRequire(__DIR__ . '/../config/graphiql.php'),
            'sslcommerz'         => File::getRequire(__DIR__ . '/../config/sslcommerz.php'),
            'broadcasting'       => File::getRequire(__DIR__ . '/../config/broadcasting.php')
        ]);

        // Register the service the package provides.
        $this->app->singleton('shop', function () {
            return new Shop();
        });

        $this->app->singleton('payment', function ($app) {
            $active_payment_gateway = '';
            $settings = Settings::first();

            if (!empty(request()) && request()->has('payment_gateway') && !in_array(request()['payment_gateway'], [PaymentGatewayType::CASH_ON_DELIVERY, PaymentGatewayType::CASH])) {
                $active_payment_gateway = ucfirst(strtolower(request()['payment_gateway']));
            } else {
                $active_payment_gateway = $settings->options['defaultPaymentGateway'];
            }

            try {
                $gateway = 'Marvel\\Payments\\' . ucfirst($active_payment_gateway);
                return new Payment($app->make($gateway));
            } catch (\Throwable $th) {
                $gateway = 'Marvel\\Payments\\' . ucfirst($settings->options['defaultPaymentGateway']);
                return new Payment($app->make($gateway));
            }
        });

        $this->app->singleton('ai', function ($app) {
            $active_ai = '';
            $settings = Settings::first();

            if (!empty(request()) && request()->has('artificial_intelligence')) {
                $active_ai = ucfirst(strtolower(request()['artificial_intelligence']));
            } else {
                $active_ai = $settings->options['defaultAi'];
            }

            $ai = 'Marvel\\Ai\\' . ucfirst($active_ai);
            return new Ai($app->make($ai));
        });

        $this->app->singleton(MarvelVerification::class, function ($app) {
            return new MarvelVerification();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides(): array
    {
        return ['shop'];
    }

    /**
     * Console-specific booting.
     *
     * @return void
     */
    protected function bootForConsole(): void
    {
        // Publishing the configuration file.
        $this->publishes([
            __DIR__ . '/../config//shop.php' => config_path('shop.php'),
        ], 'config');

        $this->commands($this->commandList);
    }


    /**
     * Load Middleware from shop
     */
    protected function loadMiddleware(): void
    {
        if (!is_array($this->routeMiddleware) ||  empty($this->routeMiddleware)) {
            return;
        }

        foreach ($this->routeMiddleware as $alias => $middleware) {
            $this->app->router->aliasMiddleware($alias, $middleware);
        }
    }
}
