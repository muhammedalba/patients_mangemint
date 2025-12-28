<?php

namespace App\Domain\Appointments\Exceptions;

use Exception;

class AppointmentConflictException extends Exception
{
     public string $field;

    public function __construct(string $field, string $message)
    {
        parent::__construct($message);
        $this->field = $field;
    }
}
