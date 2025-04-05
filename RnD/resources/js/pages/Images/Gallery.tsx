import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Gallery({ images }) {
    return (
        <GuestLayout>
            <Head title="Public Gallery" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Public Image Gallery</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse through our collection of beautiful images shared by our community.
                        </p>
                    </div>

                    {images.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-xl">No images available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {images.map((image) => (
                                <div key={image.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                                    <img 
                                        src={`/storage/${image.file_path}`} 
                                        alt={image.title}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2 truncate">{image.title}</h3>
                                        <p className="text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>By {image.user.name}</span>
                                            <span>{new Date(image.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
