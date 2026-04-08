<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Hosting;
use App\Models\Client;
use Inertia\Inertia;

class HostingController extends Controller
{
    public function index(Request $request)
    {
        $query = Hosting::with(['client', 'payments' => function($q) {
            $q->orderBy('due_date', 'asc');
        }]);

        if ($request->has('client_id') && $request->client_id != '') {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('plan') && $request->plan != 'todos') {
            $query->where('plan', $request->plan);
        }

        if ($request->has('date') && $request->date != '') {
            $query->whereDate('start_date', '>=', $request->date);
        }

        return Inertia::render('Hostings/Index', [
            'hostings' => $query->latest()->get(),
            'clients' => Client::all(),
            'filters' => $request->only(['client_id', 'plan', 'date'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'plan' => 'required|in:mensal,semestral,anual',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'installments' => 'required|integer|min:1',
        ]);

        $hosting = Hosting::create($request->only(['client_id', 'plan', 'value', 'start_date']));

        $installments = $request->input('installments');
        $monthsToAdd = 1;
        if ($hosting->plan == 'semestral') $monthsToAdd = 6;
        if ($hosting->plan == 'anual') $monthsToAdd = 12;

        $currentDate = \Carbon\Carbon::parse($hosting->start_date);
        
        for ($i = 0; $i < $installments; $i++) {
            $hosting->payments()->create([
                'tenant_id' => $hosting->tenant_id,
                'due_date' => $currentDate->format('Y-m-d'),
                'is_paid' => false,
            ]);
            $currentDate->addMonths($monthsToAdd);
        }

        return redirect()->back();
    }

    public function update(Request $request, Hosting $hosting)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'plan' => 'required|in:mensal,semestral,anual',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        $hosting->update($validated);

        return redirect()->back();
    }

    public function destroy(Hosting $hosting)
    {
        $hosting->delete();
        return redirect()->back();
    }

    public function togglePayment(\App\Models\HostingPayment $payment)
    {
        $payment->update([
            'is_paid' => !$payment->is_paid,
            'paid_at' => $payment->is_paid ? null : now(),
        ]);
        return redirect()->back();
    }
}
