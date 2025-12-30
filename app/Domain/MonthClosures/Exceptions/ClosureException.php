<?php

namespace App\Domain\MonthClosures\Exceptions;

use App\Domain\Exceptions\DomainRuleException;
use Exception;

class ClosureException extends DomainRuleException
{
    // public string $field;

    // public function __construct(string $field, string $message)
    // {
    //     parent::__construct($message);
    //     $this->field = $field;
    // }
}
