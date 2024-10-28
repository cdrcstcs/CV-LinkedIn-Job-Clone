<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationQuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['application_question_id', 'application_answer_id', 'answer'];
}
