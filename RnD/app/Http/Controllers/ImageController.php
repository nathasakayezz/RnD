<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ImageController extends Controller
{
    public function index()
    {
        $images = Image::with('user')->latest()->get();
        
        return Inertia::render('Images/Index', [
            'images' => $images
        ]);
    }

    public function create()
    {
        return Inertia::render('Images/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('image')->store('public/images');
        
        Image::create([
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => str_replace('public/', '', $path),
            'user_id' => auth()->id(),
        ]);

        return Redirect::route('images.index')->with('message', 'Image uploaded successfully');
    }

    public function edit(Image $image)
    {
        return Inertia::render('Images/Edit', [
            'image' => $image
        ]);
    }

    public function update(Request $request, Image $image)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        if ($request->hasFile('image')) {
            // Delete the old image
            if ($image->file_path) {
                Storage::delete('public/' . $image->file_path);
            }
            
            // Store the new image
            $path = $request->file('image')->store('public/images');
            $data['file_path'] = str_replace('public/', '', $path);
        }

        $image->update($data);

        return Redirect::route('images.index')->with('message', 'Image updated successfully');
    }

    public function destroy(Image $image)
    {
        // Delete the image file from storage
        if ($image->file_path) {
            Storage::delete('public/' . $image->file_path);
        }
        
        $image->delete();

        return Redirect::route('images.index')->with('message', 'Image deleted successfully');
    }
}
