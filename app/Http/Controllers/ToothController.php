<?php

namespace App\Http\Controllers;

use App\Domain\Teeth\DTOs\ToothData;
use App\Domain\Teeth\Services\ToothService;
use App\Http\Requests\ToothStoreRequest;
use App\Http\Requests\ToothUpdateRequest;
use App\Models\Tooth;
use App\Models\Patient;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ToothController extends Controller
{
    private ToothService $service;

    public function __construct(ToothService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');

        $teeth = $this->service->listTeeth($search, 10);

        return Inertia::render('Teeth/Index', [
            'teeth' => $teeth,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request, $patient_id = null)
    {
        // patient_id from query params if exists
        $patient_id = $patient_id ?? $request->query('patient_id');
        $patients = $patient_id ? collect([Patient::findOrFail($patient_id)->only(['id', 'name'])]) : Patient::select('id', 'name')->latest('updated_at')->get();


        return Inertia::render('Teeth/Create', [
            'patients' => $patients,
            'patient_id' => $patient_id,
        ]);
    }

    public function store(ToothStoreRequest $request)
    {
        $validated = $request->validated();

        $data = ToothData::fromValidated($validated);

        $this->service->create($data);

        return redirect()
            ->route('patients.details', $request->patient_id)
            ->with('success', 'Tooth created successfully.');
    }

    public function edit(Tooth $tooth)
    {
        $tooth->load([
            'procedures',
            'patient:id,name',
        ]);
        return Inertia::render('Teeth/Edit', ['tooth' => $tooth]);
    }

    public function update(ToothUpdateRequest $request, Tooth $tooth)
    {
        $validated = $request->validated();

        $data = ToothData::fromValidated($validated);

        $this->service->update($tooth, $data);

        return redirect()
            ->route('patients.details', $request->patient_id)
            ->with('success', 'Tooth updated successfully.');
    }

    public function destroy(Tooth $tooth)
    {
        $patient_id = $tooth->patient_id;

        $this->service->delete($tooth);

        return redirect()->route('patients.details', $patient_id)->with('success', 'Teeth deleted successfully.');
    }
}
