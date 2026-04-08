<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;

class Hosting extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'client_id', 'plan', 'value', 'start_date'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function payments()
    {
        return $this->hasMany(HostingPayment::class);
    }
}
