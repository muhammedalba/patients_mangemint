<?php

namespace App\Domain\MonthClosures\Exceptions;

use Exception;

class ClosureException extends Exception
{
    public string $field;

    public function __construct(string $field, string $message)
    {
        parent::__construct($message);
        $this->field = $field;
    }
}
