<?php

namespace App\Domain\MonthClosures\Services;

use App\Domain\MonthClosures\DTOs\MonthClosureData;
use App\Domain\MonthClosures\Repositories\MonthClosureRepository;
use App\Models\MonthClosure;
use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use App\Domain\MonthClosures\Exceptions\MonthAlreadyClosedException;
use App\Domain\MonthClosures\Exceptions\MonthClosureException;
use App\Domain\MonthClosures\Exceptions\MonthInFutureException;
use App\Domain\MonthClosures\Exceptions\NoExpensesException;
use Illuminate\Database\QueryException;
use Carbon\Carbon;

class MonthClosureService
{
    public function __construct(private MonthClosureRepository $repository) {}

    public function list(?string $year = null, int $perPage = 15)
    {
        return $this->repository->list($year, $perPage);
    }

    public function closeMonth(MonthClosureData $data): MonthClosure
    {
        // validate preconditions and then perform the closure in a transaction
        $this->validatePreconditions($data, requireExpenses: true);

        // calculate date range for the month (useful for indexed range queries)
        $start = Carbon::create($data->year, $data->month, 1)->startOfDay();
        $end = $start->copy()->endOfMonth()->endOfDay();

        try {
            return DB::transaction(function () use ($data, $start, $end) {
                // lock expenses in that month using a range to leverage indexes
                Expense::whereBetween('expense_date', [$start->toDateTimeString(), $end->toDateTimeString()])
                    ->update(['is_locked' => true]);

                // create closure record
                return $this->repository->create($data->toArray());
            });
        } catch (QueryException $e) {
            // If DB unique constraint was violated concurrently, surface a domain exception
            $sqlState = $e->getCode();
            $msg = $e->getMessage();

            if ($sqlState === '23000' || stripos($msg, 'duplicate') !== false) {
                throw new MonthAlreadyClosedException('month', 'Month already closed');
            }

            throw $e;
        }
    }




    public function validatePreconditions(MonthClosureData $data, bool $requireExpenses = true): void
    {
        $currentYear = (int) date('Y');
        $currentMonth = (int) date('m');

        // do not allow closing current or future months
        if ($data->year > $currentYear) {
            throw new MonthInFutureException('year', "Cannot close future year{$data->year}.");
        }
        if (($data->year == $currentYear && $data->month >= $currentMonth)) {
            throw new MonthInFutureException('month', "Cannot close current or future months ({$data->month} Only past months are allowed to be closed.");
        }

        // prevent duplicate closure
        if (MonthClosure::where('year', $data->year)->where('month', $data->month)->exists()) {
            throw new MonthAlreadyClosedException('month', "Month {$data->month}/{$data->year} is already closed");
        }

        if ($requireExpenses) {
            $start = Carbon::create($data->year, $data->month, 1)->startOfDay();
            $end = $start->copy()->endOfMonth()->endOfDay();

            $hasExpenses = Expense::whereBetween('expense_date', [$start->toDateTimeString(), $end->toDateTimeString()])->exists();

            if (! $hasExpenses) {
                throw new NoExpensesException('month', "No expenses found for {$data->month}/{$data->year}");
            }
        }
    }
}
