<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNoRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next ,$roles): Response
    {
        $user = auth()->user();

        if (!$user || !$user->hasRole(explode('|', $roles))) {
            // إعادة توجيه إلى الصفحة الرئيسية
            return redirect()->route('register')->with('error', 'ليس لديك الصلاحية للدخول');
        }

        return $next($request);
    }
}
