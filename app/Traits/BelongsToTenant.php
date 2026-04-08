<?php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            if (session()->has('tenant_id')) {
                $model->tenant_id = session()->get('tenant_id');
            } elseif (Auth::check()) {
                $model->tenant_id = Auth::user()->tenant_id;
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (session()->has('tenant_id')) {
                $builder->where('tenant_id', session()->get('tenant_id'));
            } elseif (Auth::check()) {
                $builder->where('tenant_id', Auth::user()->tenant_id);
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
