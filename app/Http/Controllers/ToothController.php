<?php

namespace App\Http\Controllers;

use App\Models\Tooth;
use App\Models\Patient;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ToothController extends Controller
{

public function index(Request $request)
{
    $search = $request->query('search');

    $teeth = Tooth::with(['patient', 'procedures'])
        ->when($search, function ($query, $search) {
            $query->where('tooth_number', 'like', "%{$search}%")
                ->orWhereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                })
                ->orWhereHas('procedures', function ($q) use ($search) {
                    $q->where('type', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
        })
        ->orderBy('id', 'desc')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Teeth/Index', [
        'teeth' => $teeth,
        'filters' => [
            'search' => $search,
        ],
    ]);
}

    public function create(Request $request)
    {
        $patient_id = $request->query('patient_id');
        $patients = Patient::all();
        return Inertia::render('Teeth/Create', [
            'patients' => $patients,
            'patient_id' => $patient_id,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'tooth_number' => 'required|string|max:255',
            'status' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Tooth::create($validated);

        if ($request->has('patient_id')) {
            return redirect()->route('patients.show', $request->patient_id)->with('success', 'Teeth created successfully.');
        }

        return redirect()->route('tooth.index')->with('success', 'Teeth created successfully.');
    }

    public function edit(Tooth $tooth)
    {
        $tooth->load('procedures');
        return Inertia::render('Teeth/Edit', ['tooth' => $tooth]);
    }

    public function update(Request $request, Tooth $tooth)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'tooth_number' => 'required|string|max:255',
            'status' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $tooth->update($validated);

        if ($request->has('patient_id')) {
            return redirect()->route('patients.show', $request->patient_id)->with('success', 'Teeth updated successfully.');
        }

        return redirect()->route('tooth.index')->with('success', 'Teeth updated successfully.');
    }

    public function destroy(Tooth $tooth)
    {
        $patient_id = $tooth->patient_id;
        $tooth->delete();

        return redirect()->route('patients.show', $patient_id)->with('success', 'Teeth deleted successfully.');
    }
}
