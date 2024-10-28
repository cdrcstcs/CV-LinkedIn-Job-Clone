<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Application;
use App\Models\ApplicationQuestion;
use App\Models\ApplicationAnswer;
use App\Models\ApplicationQuestionAnswer;
use Faker\Factory as Faker; // Import Faker

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a Faker instance
        $faker = Faker::create();

        // Create users
        $users = User::factory()
            ->count(1) // Adjust the number of users as needed
            ->create();

        // Create applications with associated questions and answers
        foreach ($users as $user) {
            Application::factory()
                ->count(10) // Adjust the number of applications per user as needed
                ->create(['user_id' => $user->id])
                ->each(function ($application) use ($faker) { // Pass Faker instance
                    // Create associated ApplicationQuestions
                    ApplicationQuestion::factory()
                        ->count(10) // Adjust the number of questions per application as needed
                        ->create(['application_id' => $application->id])
                        ->each(function ($question) use ($application, $faker) { // Pass Faker instance
                            // Create an associated ApplicationAnswer
                            $answer = ApplicationAnswer::factory()
                                ->create(['application_id' => $application->id]);

                            // Create an associated ApplicationQuestionAnswer
                            ApplicationQuestionAnswer::factory()
                                ->create([
                                    'application_question_id' => $question->id,
                                    'application_answer_id' => $answer->id,
                                    'answer' => $faker->sentence, // Use the Faker instance
                                ]);
                        });
                });
        }
    }
}