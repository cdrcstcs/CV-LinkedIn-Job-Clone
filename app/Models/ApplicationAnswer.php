<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationAnswer extends Model
{
    use HasFactory;

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = ['application_id', 'start_date', 'end_date'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
