<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class FinancialTransaction extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'client_id', 'project_id', 'type', 'value', 'date', 'description'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
