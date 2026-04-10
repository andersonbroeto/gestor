<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\Client;
use App\Models\FinancialTransaction;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $statusOrder = "CASE status WHEN 'orcamento' THEN 1 WHEN 'em_andamento' THEN 2 WHEN 'concluido' THEN 3 END";

        $query = Project::with('client');

        if ($request->has('status') && $request->status !== 'todos') {
            $query->where('status', $request->status);
        }

        $projects = $query
            ->orderByRaw($statusOrder)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($project) {
                $transactions = FinancialTransaction::where('project_id', $project->id)->get();

                $project->total_received = $transactions->where('type', 'receita')->sum('value');
                $project->total_costs    = $transactions->where('type', 'despesa')->sum('value');
                $project->remaining_to_receive = $project->budget - $project->total_received;
                $project->net_profit     = $project->total_received - $project->total_costs;
                $project->projected_profit = $project->budget - $project->total_costs;

                return $project;
            });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'clients'  => Client::all(),
            'totals'   => [
                'budget'   => $projects->sum('budget'),
                'received' => $projects->sum('total_received'),
                'pending'  => $projects->sum('remaining_to_receive'),
            ],
            'filters' => $request->only(['status'])
        ]);
    }

    public function show(Project $project)
    {
        $project->load('client');
        $transactions = FinancialTransaction::where('project_id', $project->id)
            ->orderBy('date', 'desc')
            ->get();

        $tasks = \App\Models\Task::where('project_id', $project->id)
            ->orderByRaw("CASE status WHEN 'iniciar' THEN 1 WHEN 'em_andamento' THEN 2 WHEN 'concluida' THEN 3 END")
            ->get();

        $project->total_received       = $transactions->where('type', 'receita')->sum('value');
        $project->total_costs          = $transactions->where('type', 'despesa')->sum('value');
        $project->remaining_to_receive = $project->budget - $project->total_received;
        $project->net_profit           = $project->total_received - $project->total_costs;
        $project->projected_profit     = $project->budget - $project->total_costs;

        return Inertia::render('Projects/Show', [
            'project'      => $project,
            'transactions' => $transactions,
            'tasks'        => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:orcamento,em_andamento,concluido',
            'notes' => 'nullable|string',
        ]);

        Project::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:orcamento,em_andamento,concluido',
            'notes' => 'nullable|string',
        ]);

        $project->update($validated);

        return redirect()->back();
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index');
    }
}
