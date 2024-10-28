<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\ApplicationQuestion;
use App\Models\ApplicationAnswer;
use App\Models\ApplicationQuestionAnswer;

use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    // Static array of tech company images
    protected $techCompanyImages = [
        'https://logohistory.net/wp-content/uploads/2023/06/AWS-Emblem.png',
        'https://logos-world.net/wp-content/uploads/2020/11/GitHub-Logo.png',
        'http://www.clipartbest.com/cliparts/4c9/o4R/4c9o4Rooi.jpeg',
        'http://pluspng.com/img-png/google-logo-png-google-logo-icon-png-transparent-background-1000.png',
        'https://tse2.mm.bing.net/th?id=OIP.Amtad6cu5WsYrZ3gC2IgGgHaFj&pid=Api&P=0&h=180',
        'https://tse3.mm.bing.net/th?id=OIP.tJwzYFnd3ueF1zEY0GB2sAHaBz&pid=Api&P=0&h=180',
        'https://tse4.mm.bing.net/th?id=OIP.8X_lapTX1VwsdFdHfZikXgHaFj&pid=Api&P=0&h=180',
        'https://tse3.mm.bing.net/th?id=OIP.kNWAt-y7c0XIIry-_jq6ZwHaHa&pid=Api&P=0&h=180',
        'https://tse1.mm.bing.net/th?id=OIP.9N0sjeFMOOkcfuOwzldzLwHaHa&pid=Api&P=0&h=180',
        'https://tse2.mm.bing.net/th?id=OIP.C4fKsJadhinUb8drZnaucAHaEo&pid=Api&P=0&h=180',
        'https://tse4.mm.bing.net/th?id=OIP.3c5xTRnB9dbXuJYsJUSf4gHaCm&pid=Api&P=0&h=180',
    ];

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'expire_date' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'image' => $this->faker->randomElement($this->techCompanyImages), // Use a random tech company image
            'user_id' => \App\Models\User::factory(), // Assuming you have a User factory
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (Application $application) {
            // Create associated ApplicationQuestions
            ApplicationQuestion::factory()
                ->count(3) // Change count as needed
                ->create(['application_id' => $application->id])
                ->each(function ($question) use ($application) {
                    // Create associated ApplicationAnswers for each question
                    $answer = ApplicationAnswer::factory()
                        ->create(['application_id' => $application->id]);
    
                    // Now create ApplicationQuestionAnswer
                    ApplicationQuestionAnswer::factory()
                        ->create([
                            'application_question_id' => $question->id,
                            'application_answer_id' => $answer->id,
                            'answer' => $this->faker->sentence, // Optionally add an answer
                        ]);
                });
        });
    }
    
}
