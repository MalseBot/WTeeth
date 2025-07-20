/** @format */

import React from 'react';

export default function ItemAmount({ e }: any) {
	const percentage = Math.min(100, (e.currentAmount / e.quantity) * 100);
	const shortage = e.currentAmount <= e.itemShortage ? 0 : 1; // Always returns number

	return (
		<div className='relative flex h-2.5 w-full overflow-hidden rounded-full border bg-blue-gray-50 font-sans text-xs font-medium'>
			<div
				style={{
					width: `${percentage}%`,
				}}
				className={cn(
					'relative h-full rounded-full transition-all duration-300 ',
					shortage ? 'bg-secondary' : 'bg-destructive'
				)}
			/>
		</div>
	);
}

// Simple cn utility if you don't have it from shadcn
function cn(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}
