/** @format */

'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from './ui/spinner';

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const { status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Allow unauthenticated access to /sign-in and /sign-up
		if (
			status === 'unauthenticated' &&
			pathname !== '/sign-in' &&
			pathname !== '/sign-up'
		) {
			router.replace('/sign-in');
		}
	}, [status, router, pathname]);

	if (status === 'loading') {
		return (
			<>
				<div className='h-screen w-screen'>
					<Spinner>Loading ...</Spinner>
				</div>
			</>
		);
	}
	if (
		status === 'authenticated' ||
		pathname === '/sign-in' ||
		pathname === '/sign-up'
	) {
		return <>{children}</>;
	}

	// Optionally, render nothing while redirecting
	return null;
}
