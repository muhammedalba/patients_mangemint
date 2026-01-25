<?php

namespace App\Domain\Patients\Exceptions;

use App\Domain\Exceptions\DomainRuleException;

class InvalidDiscountException extends DomainRuleException
{
    public function __construct(float $discount=0, float $total, ?string $message= null)
    {
        $errorMessage = $message ??  __("Discount amount ($discount) cannot exceed total procedures cost ($total).");

        parent::__construct(
            'discount_amount',
            $errorMessage,
            false,
            422
        );
    }
}
