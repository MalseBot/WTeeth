/** @format */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get('file');

	if (!file || typeof file === 'string') {
		return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
	}

	// Read the file as a buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Ensure the media directory exists
	const mediaDir = path.resolve('./public', 'media');
	if (!fs.existsSync(mediaDir)) {
		fs.mkdirSync(mediaDir,{recursive: true});
	}
    let extension = '';
		if ('name' in file && typeof file.name === 'string') {
			const parts = file.name.split('.');
			if (parts.length > 1) {
				extension = '.' + parts.pop();
			}
		}
	// Save the file (you may want to generate a unique name)
	const uniqueName = `image_${Date.now()}${extension}`;
    const filePath = path.join(mediaDir, uniqueName);
	fs.writeFileSync(filePath, buffer);

	return NextResponse.json({ success: true , filename: uniqueName});
}

export async function GET() {
	const mediaDir = path.resolve('.', 'media');
	let files: string[] = [];
	if (fs.existsSync(mediaDir)) {
		files = fs.readdirSync(mediaDir);
	}
	return NextResponse.json({ images: files });
}
