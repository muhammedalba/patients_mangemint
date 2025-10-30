<?php

namespace App\Http\Controllers;

use App\Models\Tooth;
use App\Models\Patient;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
               ->orderByDesc('id')
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
        'tooth_number' => [
            'required',
            'string',
            'max:255',
            Rule::unique('teeth')->where(function ($query) use ($request) {
                return $query->where('patient_id', $request->patient_id);
            }),
        ],
        'status' => 'nullable|string|max:255',
        'notes' => 'nullable|string',
    ]);

    Tooth::create($validated);

    return redirect()
        ->route('patients.details', $request->patient_id)
        ->with('success', 'Tooth created successfully.');
}

    public function edit(Tooth $tooth)
    {
          $tooth->load([
        'procedures',
        'patient:id,name', // ← تحميل المريض فقط مع id و name
    ]);
        return Inertia::render('Teeth/Edit', ['tooth' => $tooth]);
    }

   public function update(Request $request, Tooth $tooth)
{
    $validated = $request->validate([
        'patient_id' => 'required|exists:patients,id',
        'tooth_number' => [
            'required',
            'string',
            'max:255',
            Rule::unique('teeth')
                ->where(function ($query) use ($request) {
                    return $query->where('patient_id', $request->patient_id);
                })
                ->ignore($tooth->id), // ← تجاهل السجل الحالي أثناء التحقق من التفرد
        ],
        'status' => 'nullable|string|max:255',
        'notes' => 'nullable|string',
    ]);

    $tooth->update($validated);

    return redirect()
        ->route('patients.details', $request->patient_id)
        ->with('success', 'Tooth updated successfully.');
}

    public function destroy(Tooth $tooth)
    {
        $patient_id = $tooth->patient_id;
        $tooth->delete();

        return redirect()->route('patients.details', $patient_id)->with('success', 'Teeth deleted successfully.');
    }
}
