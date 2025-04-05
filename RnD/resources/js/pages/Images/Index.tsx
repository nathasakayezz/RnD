import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Image, BreadcrumbItem } from '@/types';
import { HeartIcon, ShareIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Props {
    images: Image[];
    auth: {
        user: User;
    };
    flash: {
        message?: string;
    };
}

export default function Index({ auth, images, flash }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'My Images',
            href: route('images.index'),
        },
    ];
    console.log(images.file_path, '<<<<')

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Images" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">My Image Gallery</h1>
                            <p className="text-gray-600">Manage your images with ease</p>
                        </div>
                        <Link 
                            href={route('images.create')} 
                            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Upload New Image
                        </Link>
                    </div>

                    {images.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">No images yet</h2>
                            <p className="text-gray-500 mb-6">Upload your first image to get started</p>
                            <Link 
                                href={route('images.create')} 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md"
                            >
                                Upload First Image
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {images.map((image) => (
                                <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl">
                                    <div className="relative">
                                        <img 
                                            src={`/storage/public/${image.file_path}`} 
                                            alt={image.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                                            <div className="p-4 w-full">
                                                <div className="flex justify-between items-center">
                                                    <Link
                                                        href={`/storage/${image.file_path}`}
                                                        target="_blank"
                                                        className="text-white bg-black/30 hover:bg-black/40 p-2 rounded-full transition"
                                                    >
                                                        
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    
                                                    {auth.user.id === image.user_id && (
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('images.edit', image.id)}
                                                                className="text-white bg-black/30 hover:bg-black/40 p-2 rounded-full transition"
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                href={route('images.destroy', image.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="text-white bg-black/30 hover:bg-red-500 p-2 rounded-full transition"
                                                                onClick={(e) => {
                                                                    if (!confirm('Are you sure you want to delete this image?')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{image.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {image.description || 'No description provided.'}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(image.user.name)}&background=random`} 
                                                    alt={image.user.name}
                                                    className="w-6 h-6 rounded-full mr-2"
                                                />
                                                <span>{image.user.name}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(image.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <button className="flex items-center text-gray-500 hover:text-red-500 transition">
                                                <HeartIcon className="h-5 w-5 mr-1" />
                                                <span>Like</span>
                                            </button>
                                            <button className="flex items-center text-gray-500 hover:text-blue-500 transition">
                                                <ShareIcon className="h-5 w-5 mr-1" />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
