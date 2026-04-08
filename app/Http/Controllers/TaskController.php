<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;
use App\Models\Client;
use App\Models\Project;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        return Inertia::render('Tasks/Index', [
            'tasks' => Task::with(['client', 'project'])->get(),
            'clients' => Client::all(),
            'projects' => Project::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:iniciar,em_andamento,concluida',
        ]);

        Task::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:iniciar,em_andamento,concluida',
        ]);

        $task->update($validated);

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back();
    }
}
