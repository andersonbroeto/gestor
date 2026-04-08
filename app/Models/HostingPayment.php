<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant;

class HostingPayment extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'hosting_id', 'due_date', 'is_paid', 'paid_at'];

    protected $casts = [
        'due_date' => 'date',
        'is_paid' => 'boolean',
        'paid_at' => 'date',
    ];

    public function hosting()
    {
        return $this->belongsTo(Hosting::class);
    }
}
