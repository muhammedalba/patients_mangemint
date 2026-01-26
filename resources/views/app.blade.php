@routes
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <meta name="description" content="عيادة دكتور لطب وتجميل الأسنان - نقدم أفضل الخدمات الطبية بأحدث التقنيات لضمان ابتسامة مثالية وصحة فموية ممتازة.">
    <meta name="keywords" content="عيادة أسنان, تجميل الأسنان, زراعة الأسنان, تبييض الأسنان, دكتور أسنان">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ config('app.name', 'عيادة الزركون لطب الأسنان') }}">
    <meta property="og:description" content="عيادة دكتور لطب وتجميل الأسنان - نقدم أفضل الخدمات الطبية بأحدث التقنيات لضمان ابتسامة مثالية وصحة فموية ممتازة.">
    <meta property="og:image" content="{{ asset('zirconLogo.png') }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="{{ config('app.name', 'عيادة الزركون لطب الأسنان') }}">
    <meta property="twitter:description" content="عيادة دكتور لطب وتجميل الأسنان - نقدم أفضل الخدمات الطبية بأحدث التقنيات لضمان ابتسامة مثالية وصحة فموية ممتازة.">
    <meta property="twitter:image" content="{{ asset('zirconLogo.png') }}">

    <title inertia>{{ config('app.name', 'عيادة الزركون لطب الأسنان') }}</title>

    <link rel="icon" type="image/png" href="/zirconLogo.png" sizes="64x64">
    <link rel="icon" href="/zirconLogo.png" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|cairo:400,500,600,700" rel="stylesheet" />


    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
