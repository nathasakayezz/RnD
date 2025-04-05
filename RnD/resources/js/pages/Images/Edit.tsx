import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Image as ImageType } from '@/types';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    image: ImageType;
}

interface FormData {
    title: string;
    description: string;
    image: File | null;
    _method: string;
}

export default function Edit({ auth, image }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: image.title || '',
        description: image.description || '',
        image: null,
        _method: 'PUT',
    });
    
    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'My Images',
            href: route('images.index'),
        },
        {
            title: 'Edit Image',
            href: route('images.edit', image.id),
        },
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const files = fileInput.files;
            
            if (files && files[0]) {
                handleFileSelection(files[0]);
            }
        } else {
            setData(name as keyof FormData, value);
        }
    };

    const handleFileSelection = (file: File) => {
        setData('image', file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('images.update', image.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Image" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl">
                        <div className="p-6 md:p-8 bg-white">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Image</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChange}
                                        className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="Enter image title"
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        rows={4}
                                        placeholder="Enter image description (optional)"
                                    />
                                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Current Image
                                    </label>
                                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                                        <img 
                                            src={`/storage/public/${image.file_path}`} 
                                            alt={image.title} 
                                            className="max-w-full h-auto max-h-64 rounded mx-auto"
                                        />
                                    </div>
                                    
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Replace Image (Optional)
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'} transition-colors duration-200 cursor-pointer`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('image')?.click()}
                                    >
                                        {preview ? (
                                            <div className="flex flex-col items-center">
                                                <img src={preview} alt="Preview" className="max-w-full max-h-72 rounded-lg mb-4" />
                                                <p className="text-sm text-gray-500">Click or drag to change image</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-700 mb-1">Click to select or drag and drop</p>
                                                <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            onChange={handleChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </button>
                                    <a
                                        href={route('images.index')}
                                        className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </a>
                                </div>
                            </form>
              </div>
              </div>
              </div>
              </div>
              </AppLayout>
    )
}
