<?php

namespace App\Domain\Exceptions;

use Exception;

class DomainRuleException extends Exception
{
    public ?string $field ;
    public bool $isGlobal;


    public function __construct(?string $field = null, string $message, bool $isGlobal = false)
    {
        parent::__construct($message);
        $this->field = $field ?? null;
        $this->isGlobal = $isGlobal;
    }
}
