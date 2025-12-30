<?php

namespace App\Domain\Appointments\Exceptions;

use App\Domain\Exceptions\DomainRuleException;

class AppointmentConflictException extends DomainRuleException
{
    //  public string $field;

    // public function __construct(string $field, string $message)
    // {
    //     parent::__construct($message);
    //     $this->field = $field;
    // }
}
