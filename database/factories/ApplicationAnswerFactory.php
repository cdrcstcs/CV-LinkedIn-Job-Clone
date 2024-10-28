<?php

namespace Database\Factories;

use App\Models\ApplicationAnswer;
use App\Models\ApplicationQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationAnswerFactory extends Factory
{
    protected $model = ApplicationAnswer::class;

    public function definition()
    {
        return [
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'application_id' => null, // Set later
        ];
    }
}
