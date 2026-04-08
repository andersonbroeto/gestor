<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\FinancialTransaction;
use App\Models\Project;
use App\Models\Hosting;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tasks = Task::select('status', \DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status');

        $financials = FinancialTransaction::all();
        $revenue = $financials->where('type', 'receita')->sum('value');
        $expenses = $financials->where('type', 'despesa')->sum('value');

        // Valor a receber: Budget of all projects minus what was received so far
        $totalBudget = Project::sum('budget');
        $totalReceived = FinancialTransaction::where('type', 'receita')
            ->whereNotNull('project_id')
            ->sum('value');
        $toReceive = $totalBudget - $totalReceived;

        // MRR Calculation (monthly recurring revenue from hostings)
        $hostings = Hosting::all();
        $mrr = $hostings->sum(function($hosting) {
            if ($hosting->plan == 'mensal') return $hosting->value;
            if ($hosting->plan == 'semestral') return $hosting->value / 6;
            if ($hosting->plan == 'anual') return $hosting->value / 12;
            return 0;
        });

        return Inertia::render('Dashboard', [
            'stats' => [
                'tasks' => [
                    'iniciar' => $tasks['iniciar'] ?? 0,
                    'em_andamento' => $tasks['em_andamento'] ?? 0,
                    'concluida' => $tasks['concluida'] ?? 0,
                ],
                'financial' => [
                    'revenue' => (float)$revenue,
                    'expenses' => (float)$expenses,
                    'toReceive' => (float)$toReceive,
                    'totalBudget' => (float)$totalBudget,
                    'projReceived' => (float)$totalReceived,
                    'profit' => (float)($revenue - $expenses),
                    'mrr' => (float)$mrr,
                ]
            ]
        ]);
    }
}
