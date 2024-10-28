<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('application', ApplicationController::class);
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/application/get-by-slug/{application:slug}', [ApplicationController::class, 'getBySlug']);
Route::post('/application/{application}/answer', [ApplicationController::class, 'storeAnswer']);