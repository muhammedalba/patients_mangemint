<?php

namespace App\Domain\Users\Exceptions;

use App\Domain\Exceptions\DomainRuleException;
use Throwable;

class CannotDeleteSelfException extends DomainRuleException
{
    public function __construct(string $message = 'You cannot delete your own account.', int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct(
            'message',
            $message,
            false,
            422
        );
    }
}
