/** @format */

import InfoTable from '@/components/sections/InfoTable';
import { StarFilledIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function page() {
	return (
		<div className=' min-h-screen'>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
                Storage
			</h1>
            {/* <InfoTable rows={}/> */}
		</div>
	);
}
