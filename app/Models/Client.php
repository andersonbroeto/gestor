<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Client extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'name', 'email', 'whatsapp'];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function hostings()
    {
        return $this->hasMany(Hosting::class);
    }
}
