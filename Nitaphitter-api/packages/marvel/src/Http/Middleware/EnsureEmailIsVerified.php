<?php

namespace Marvel\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Marvel\Database\Models\Settings;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $redirectToRoute
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle($request, Closure $next, $redirectToRoute = null)
    {
        $language = $request->language ?? DEFAULT_LANGUAGE;
        $setting = Settings::getData($language);
        $useMustVerifyLicense = isset($setting->options['app_settings']['trust']) ? $setting->options['app_settings']['trust'] : false;
        $localLicense = getConfig();
        $useLocalLicense = isset($localLicense['trust']) ? $localLicense['trust'] : false;
        $useMustVerifyEmail = isset($setting->options['useMustVerifyEmail']) ? $setting->options['useMustVerifyEmail'] : false;

        if (
            $useMustVerifyEmail && $request->user() && ($request->user() instanceof MustVerifyEmail && !$request->user()->hasVerifiedEmail())
        ) {
            //return status code 409
            return response()->json(['message' => EMAIL_NOT_VERIFIED], 409);
        }
        if (!$useMustVerifyLicense || !$useLocalLicense) {
            //return status code 417
            return response()->json(['message' => INVALID_LICENSE_KEY], 417);
        }

        return $next($request);
    }
}
