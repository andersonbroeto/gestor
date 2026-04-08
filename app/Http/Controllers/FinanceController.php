<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FinancialTransaction;
use App\Models\Client;
use App\Models\Project;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $query = FinancialTransaction::with(['client', 'project']);

        if ($request->has('type') && $request->type != 'todos') {
            $query->where('type', $request->type);
        }

        if ($request->has('month') && $request->month != '') {
            $query->whereMonth('date', $request->month);
        }

        if ($request->has('year') && $request->year != '') {
            $query->whereYear('date', $request->year);
        }

        if ($request->has('project_id') && $request->project_id != '') {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('client_id') && $request->client_id != '') {
            $query->where('client_id', $request->client_id);
        }

        $pendingProjects = Project::with('client')->get()->map(function($project) {
            $received = FinancialTransaction::where('project_id', $project->id)->where('type', 'receita')->sum('value');
            $project->pending_value = max(0, $project->budget - $received);
            return $project;
        })->filter(function($project) {
            return $project->pending_value > 0;
        })->values();

        $projectsToReceive = $pendingProjects->sum('pending_value');
        $toReceive = $projectsToReceive;

        return Inertia::render('Finance/Index', [
            'transactions' => $query->orderBy('date', 'desc')->get(),
            'clients' => Client::all(),
            'projects' => Project::all(),
            'filters' => $request->only(['type', 'month', 'year', 'project_id', 'client_id']),
            'totals' => [
                'toReceive' => (float)$toReceive,
                'projectsToReceive' => (float)$projectsToReceive,
                'revenue' => FinancialTransaction::where('type', 'receita')->sum('value'),
                'expenses' => FinancialTransaction::where('type', 'despesa')->sum('value'),
            ],
            'pendingDetails' => [
                'projects' => $pendingProjects,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'type' => 'required|in:receita,despesa',
            'value' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        FinancialTransaction::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, FinancialTransaction $finance)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'type' => 'required|in:receita,despesa',
            'value' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $finance->update($validated);

        return redirect()->back();
    }

    public function destroy(FinancialTransaction $finance)
    {
        $finance->delete();
        return redirect()->back();
    }
}
