<?php

namespace Database\Factories;

use App\Models\ApplicationQuestionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationQuestionAnswerFactory extends Factory
{
    protected $model = ApplicationQuestionAnswer::class;

    public function definition()
    {
        return [
            'application_question_id' => \App\Models\ApplicationQuestion::factory(), // Create a question if it doesn't exist
            'application_answer_id' => \App\Models\ApplicationAnswer::factory(), // Create an answer if it doesn't exist
            'answer' => $this->faker->sentence,
        ];
    }
}
