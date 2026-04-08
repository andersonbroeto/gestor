<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Task extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'client_id', 'project_id', 'title', 'description', 'status'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
