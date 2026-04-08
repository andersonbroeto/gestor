<?php

namespace App\Http\Controllers;

use App\Models\PasswordEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasswordEntryController extends Controller
{
    public function index()
    {
        return Inertia::render('PasswordEntries/Index', [
            'entries' => PasswordEntry::orderBy('service')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        PasswordEntry::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, PasswordEntry $password)
    {
        $validated = $request->validate([
            'service' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        $password->update($validated);

        return redirect()->back();
    }

    public function destroy(PasswordEntry $password)
    {
        $password->delete();

        return redirect()->back();
    }
}
