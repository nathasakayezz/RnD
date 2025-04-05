<?php

use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/images', [ImageController::class, 'index'])->name('images.index');
    Route::get('/images/create', [ImageController::class, 'create'])->name('images.create');
    Route::post('/images', [ImageController::class, 'store'])->name('images.store');
    Route::get('/images/{image}/edit', [ImageController::class, 'edit'])->name('images.edit');
    Route::put('/images/{image}', [ImageController::class, 'update'])->name('images.update');
    Route::delete('/images/{image}', [ImageController::class, 'destroy'])->name('images.destroy');
});

// Also add a public gallery route that doesn't require authentication
Route::get('/gallery', function () {
    $images = \App\Models\Image::with('user')->latest()->get();
    return Inertia::render('Gallery', [
        'images' => $images
    ]);
})->name('gallery');