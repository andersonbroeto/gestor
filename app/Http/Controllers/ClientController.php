<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Client;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'clients' => Client::with('projects')->withCount(['projects', 'tasks'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:20',
        ]);

        Client::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:20',
        ]);

        $client->update($validated);

        return redirect()->back();
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return redirect()->back();
    }
}
