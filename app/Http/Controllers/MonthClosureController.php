<?php

namespace App\Http\Controllers;


use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Domain\MonthClosures\DTOs\MonthClosureData;
use App\Domain\MonthClosures\Services\MonthClosureService;
use App\Http\Requests\MonthClosureStoreRequest;


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

         $this->service->closeMonth($data);
            return redirect()->route('expenses.index')->with('success', __('Month closed successfully.'));
    }
}
