<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Console\Kernel;

$app->make(Kernel::class)->bootstrap();

try {
    $tenant = Tenant::create(['name' => 'Minha Empresa']);
    User::create([
        'name' => 'Admin',
        'email' => 'admin@teste.com',
        'password' => Hash::make('12345678'),
        'tenant_id' => $tenant->id
    ]);
    echo "Usuário criado com sucesso!";
} catch (\Exception $e) {
    echo "Erro: " . $e->getMessage();
}
