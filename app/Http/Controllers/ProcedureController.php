<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Procedure;
use App\Models\Tooth;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    public function index()
    {
        $procedures = Procedure::with('tooth')->latest()->paginate(10);
        return Inertia::render('Procedures/Index', ['procedures' => $procedures]);
    }

    public function create(Request $request)
    {
        $patient_id = $request->query('patient_id');
        $teeth = $patient_id ? Tooth::where('patient_id', $patient_id)->get() : Tooth::all();
        return Inertia::render('Procedures/Create', ['teeth' => $teeth, 'patient_id' => $patient_id]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            "tooth_id" => "required|exists:teeth,id",
        ]);

        $procedure = Procedure::create($request->all());

        if ($request->has('tooth_id')) {
            $tooth = Tooth::find($request->tooth_id);
            if ($tooth) {
                return redirect()->route('patients.show', $tooth->patient_id)->with('success', 'Procedure created successfully.');
            }
        }

        return redirect()->route('procedures.index')->with('success', 'Procedure created successfully.');
    }

    public function edit(Procedure $procedure)
    {
        $teeth = Tooth::all();
        return Inertia::render('Procedures/Edit', ['procedure' => $procedure, 'teeth' => $teeth]);
    }

    public function update(Request $request, Procedure $procedure)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            "tooth_id" => "required|exists:teeth,id",
        ]);

        $procedure->update($request->all());

        if ($request->has('tooth_id')) {
            $tooth = Tooth::find($request->tooth_id);
            if ($tooth) {
                return redirect()->route('patients.show', $tooth->patient_id)->with('success', 'Procedure updated successfully.');
            }
        }

        return redirect()->route('procedures.index')->with('success', 'Procedure updated successfully.');
    }

    public function destroy(Procedure $procedure)
    {
        $tooth = Tooth::find($procedure->tooth_id);
        $patient_id = $tooth ? $tooth->patient_id : null;

        $procedure->delete();

        if ($patient_id) {
            return redirect()->route('patients.show', $patient_id)->with('success', 'Procedure deleted successfully.');
        }

        return redirect()->route('procedures.index')->with('success', 'Procedure deleted successfully.');
    }
}
