<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Patient;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('patient')->get();
        return Inertia::render('Invoices/Index', ['invoices' => $invoices]);
    }

    public function create()
    {
        $patients = Patient::all();
        return Inertia::render('Invoices/Create', compact('patients'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'total' => 'required|numeric',
            'status' => 'required|string',
        ]);

        Invoice::create($request->all());
        return redirect()->route('invoices.index');
    }

    public function edit(Invoice $invoice)
    {
        $patients = Patient::all();
        return Inertia::render('Invoices/Edit', ['invoice' => $invoice, 'patients' => $patients]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'total' => 'required|numeric',
            'status' => 'required|string',
        ]);

        $invoice->update($request->all());
        return redirect()->route('invoices.index');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index');
    }
}
