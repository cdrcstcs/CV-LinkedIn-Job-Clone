<?php

namespace App\Http\Controllers;

use App\Http\Resources\AppicationAnswerResource;
use App\Http\Resources\AppicationResourceDashboard;
use App\Models\Appication;
use App\Models\AppicationAnswer;
use Illuminate\Http\Request;

class DashboardController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        // Total Number of Appications
        $total = Appication::query()->where('user_id', $user->id)->count();

        // Latest Appication
        $latest = Appication::query()->where('user_id', $user->id)->latest('created_at')->first();

        // Total Number of answers
        $totalAnswers = AppicationAnswer::query()
            ->join('applications', 'application_answers.application_id', '=', 'applications.id')
            ->where('applications.user_id', $user->id)
            ->count();

        // Latest 5 answer
        $latestAnswers = ApplicationAnswer::query()
            ->join('applications', 'application_answers.application_id', '=', 'applications.id')
            ->where('applications.user_id', $user->id)
            ->orderBy('end_date', 'DESC')
            ->limit(5)
            ->getModels('application_answers.*');

        return [
            'totalapplications' => $total,
            'latestapplication' => $latest ? new ApplicationResourceDashboard($latest) : null,
            'totalAnswers' => $totalAnswers,
            'latestAnswers' => ApplicationAnswerResource::collection($latestAnswers)
        ];
    }
}
