'use client'
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function UploadImage() {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
		setSelectedImage(file);
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!selectedImage) return;
		const formData = new FormData();
		formData.append('file', selectedImage);
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});
		if (response.ok) {
			console.log('success');
		} else {
			console.error('failed');
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<Input
				type='file'
				onChange={handleImageChange}
				value={undefined}
			/>
			<Button>Upload image</Button>
		</form>
	);
}
