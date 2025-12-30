<?php

use App\Domain\Exceptions\DomainRuleException;

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfNoRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        // Middleware الخاصة بالراوتات (Aliases)
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'role.redirect' => RedirectIfNoRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (DomainRuleException $e, Request $request) {

            if ($request->header('X-Inertia')) {

                $redirect = redirect()
                    ->back();

                if ($e->isGlobal) {

                    return $redirect
                        ->with('error', $e->getMessage());
                }

                if ($e->field && ! $e->isGlobal) {

                    return $redirect
                        ->withErrors([$e->field => $e->getMessage()])
                        ->withInput();
                }

                return $redirect->setStatusCode(409);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->field
                        ? [$e->field => [$e->getMessage()]]
                        : null,
                ], 422);
            }

            return back()->withErrors(
                $e->field ? [$e->field => $e->getMessage()] : []
            );
        });

        $exceptions->report(function (\Throwable $e) {
            if (! $e instanceof DomainRuleException) {
                Log::error('Unhandled exception', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        });
    })->create();
