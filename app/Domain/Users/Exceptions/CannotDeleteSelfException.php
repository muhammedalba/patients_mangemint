<?php

namespace App\Domain\Users\Exceptions;

use Exception;
use Throwable;

class CannotDeleteSelfException extends Exception
{
    public function __construct(string $message = 'You cannot delete your own account.', int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
