<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('invoice')->get();
        return Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    public function create()
    {
        $invoices = Invoice::all();
        return Inertia::render('Payments/Create', compact('invoices'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
        ]);

        Payment::create($request->all());
        return redirect()->route('payments.index');
    }

    public function edit(Payment $payment)
    {
        $invoices = Invoice::all();
        return Inertia::render('Payments/Edit', ['payment' => $payment, 'invoices' => $invoices]);
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
        ]);

        $payment->update($request->all());
        return redirect()->route('payments.index');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('payments.index');
    }
}
