<?php

namespace App\Providers;

use Mpdf\Mpdf;

class PdfService
{
    public static function make(): Mpdf
    {
        return new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'direction' => 'rtl',
             'default_font' => 'dejavusans',
        ]);
    }
}
