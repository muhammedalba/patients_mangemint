<?php

namespace App\Domain\Patients\Exceptions;

use RuntimeException;

class InvalidDiscountException extends RuntimeException
{
    public function __construct(float $discount, float $total, ?string $message= null)
    {
        $errorMessage = $message ?: __("Discount amount ($discount) cannot exceed total procedures cost ($total).");

        parent::__construct(
            $errorMessage,
            422
        );
    }
}
