<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Domain\MonthClosures\DTOs\MonthClosureData;
use App\Domain\MonthClosures\Services\MonthClosureService;
use App\Http\Requests\MonthClosureStoreRequest;

use App\Domain\MonthClosures\Exceptions\MonthAlreadyClosedException;
use App\Domain\MonthClosures\Exceptions\MonthInFutureException;
use App\Domain\MonthClosures\Exceptions\NoExpensesException;

class MonthClosureController extends Controller
{
    public function __construct(private MonthClosureService $service) {}

    public function index(Request $request)
    {
        $year = $request->query('year');
        $closures = $this->service->list($year ? (int) $year : null);

        return Inertia::render('MonthClosures/Index', [
            'closures' => $closures,
            'filters' => ['year' => $year],
        ]);
    }

    public function close()
    {
        return Inertia::render('MonthClosures/Create');
    }

    // close month

    public function closeMonth(MonthClosureStoreRequest $request)
    {
        $data = MonthClosureData::fromArray($request->validated() + [
            'closed_by' => auth()->id(),
            'closed_at' => now()->toDateTimeString(),
        ]);

        try {
            $this->service->closeMonth($data);
            return redirect()->route('expenses.index')->with('success', __('Month closed successfully.'));
        } catch (MonthInFutureException | MonthAlreadyClosedException | NoExpensesException $e) {
            Log::warning('Month closure validation failed', ['error' => $e->getMessage(), 'year' => $data->year, 'month' => $data->month]);
            throw $e;
        } catch (\Throwable $e) {
            Log::error('Failed to close month', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'year' => $data->year, 'month' => $data->month]);
            return redirect()->back()->with('error', __('Failed to close month.'));
        }
    }
}
