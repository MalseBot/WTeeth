/** @format */

import ItemForm from '@/components/ItemForm';
import InfoTable from '@/components/sections/InfoTable';
import { getStorage } from '@/lib/fetching';
import { StarFilledIcon } from '@radix-ui/react-icons';
import React from 'react';

export default async function page() {
	const storageRows = await getStorage();
	return (
		<div className=' min-h-screen'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'>
					<StarFilledIcon
						width={25}
						height={25}
						className='mx-1 text-yellow-300 '
					/>
					Storage
				</h1>
				<div className='mx-10'>
				<ItemForm />
				</div>
			</div>

			<InfoTable
				rows={storageRows}
				type='storage'
			/>
		</div>
	);
}
