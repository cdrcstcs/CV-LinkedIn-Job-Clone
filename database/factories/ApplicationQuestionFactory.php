<?php

namespace Database\Factories;

use App\Models\ApplicationQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationQuestionFactory extends Factory
{
    protected $model = ApplicationQuestion::class;

    public function definition()
    {
        return [
            'type' => $this->faker->randomElement(['text']),
            'question' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'data' => $this->faker->text,
            'application_id' => null, // Set later
        ];
    }
}
