<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Procedure;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    public function index()
    {
        $procedures = Procedure::latest()->paginate(10);
        return Inertia::render('Procedures/Index', ['procedures' => $procedures]);
    }

    public function create()
    {
        return Inertia::render('Procedures/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
        ]);

        Procedure::create($request->all());
        return redirect()->route('procedures.index')->with('success', 'Procedure created successfully.');
    }

    public function edit(Procedure $procedure)
    {
        return Inertia::render('Procedures/Edit', ['procedure' => $procedure]);
    }

    public function update(Request $request, Procedure $procedure)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
        ]);

        $procedure->update($request->all());
        return redirect()->route('procedures.index')->with('success', 'Procedure updated successfully.');
    }

    public function destroy(Procedure $procedure)
    {
        $procedure->delete();
        return redirect()->route('procedures.index')->with('success', 'Procedure deleted successfully.');
    }
}
