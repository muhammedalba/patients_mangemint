<?php

namespace App\Http\Controllers;

use App\Models\Patient;
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
public function create(Request $request, $patient_id = null)
{
    // تحديد معرّفات المريض والسن إن وُجدا
    $patientId = $patient_id ?? $request->query('patient_id');
    $toothId = $request->query('tooth_id');

    // بناء الاستعلام تدريجياً (أكثر مرونة وكفاءة)
    $query = Tooth::query();

    if ($toothId) {
        $query->where('id', $toothId);
    } elseif ($patientId) {
        $query->where('patient_id', $patientId);
    }

    $teeth = $query->get();

    // جلب المرضى بأعمدة مختصرة لتقليل الحجم المرسَل للواجهة
    $patients = Patient::select('id', 'name')->get();

    return Inertia::render('Procedures/Create', [
        'teeth' => $teeth,
        'patient_id' => $patientId,
        'patients' => $patients,
    ]);
}
    // public function create(Request $request, $patient_id = null)
    // {
    //     // تحديد المريض إما من معرّف الـ route أو من query parameter
    //     $patientId = $patient_id ?? $request->query('patient_id');
    //     $tooth_id = $request->query('tooth_id');


    //     // جلب الأسنان الخاصة بالمريض إن وجد، وإلا جلب جميع الأسنان
    //     $teeth = $patientId
    //         ? Tooth::where('patient_id', $patientId)->get()
    //         : Tooth::all();
    //     if ($tooth_id) {
    //         $teeth = Tooth::where('id', $tooth_id)->get();
    //     };

    //     // جلب جميع المرضى لعرضهم في القائمة المنسدلة مثلًا
    //     $patients = Patient::select('id', 'name')->get();

    //     return Inertia::render('Procedures/Create', [
    //         'teeth' => $teeth,
    //         'patient_id' => $patientId,
    //         'patients' => $patients,
    //     ]);
    // }

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
