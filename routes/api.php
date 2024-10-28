<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Explicit routes for ApplicationController
    Route::get('/application', [ApplicationController::class, 'index']); // List all applications with search
    Route::get('/application/user', [ApplicationController::class, 'userApplication']); // List user's applications
    Route::get('/application/{application}', [ApplicationController::class, 'show']); // Show a specific application
    Route::post('/application', [ApplicationController::class, 'store']); // Store a new application
    Route::put('/application/{application}', [ApplicationController::class, 'update']); // Update a specific application
    Route::delete('/application/{application}', [ApplicationController::class, 'destroy']); // Delete a specific application
    Route::post('/application/{application}/answer', [ApplicationController::class, 'storeAnswer']); // Store answers for a specific application
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/application/get-by-slug/{application:slug}', [ApplicationController::class, 'getBySlug']);
