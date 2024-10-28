<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('application_question_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\ApplicationQuestion::class, 'application_question_id');
            $table->foreignIdFor(\App\Models\ApplicationAnswer::class, 'application_answer_id');
            $table->text('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('application_question_answers');
    }
};
