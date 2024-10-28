<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'type', 'question', 'description', 'data', 'application_id'];

}
