'use client'

import React, { useEffect, useState } from 'react';
import UploadImage from './UploadImage';

export const ImageDocument = () => {
	const [images, setImages] = useState<string[]>([]);
        //implement appointmentid to get the images attached to the specified appointment
	useEffect(() => {
		fetch('/api/upload')
			.then((res) => res.json())
			.then((data) => setImages(data.images || []));
	}, []);

	return (
		<div>
			<UploadImage />
			<div style={{ marginTop: 20 }}>
				{images.map((img) => (
					<img
						key={img}
						src={`/media/${img}`}
						alt={img}
						style={{ maxWidth: 200, margin: 10 }}
					/>
				))}
			</div>
		</div>
	);
};
