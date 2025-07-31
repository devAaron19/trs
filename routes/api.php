<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function(){
    Route::post('register',[AuthController::class,'register']);
    Route::post('login',[AuthController::class,'login']);
});

Route::middleware(['auth:api'])->group(function () {
    
    Route::post('logout',[AuthController::class,'logout']);
    Route::get('users/me',[AuthController::class,'me']);

    Route::apiResource('products',ProductController::class)->except('create', 'edit');
});