/** @format */

'use client';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import LaunchUI from '../../logos/launch-ui';
import { Button, type ButtonProps } from '../../ui/button';
import {
	Navbar as NavbarComponent,
	NavbarLeft,
	NavbarRight,
} from '../../ui/navbar';
import Navigation from '../../ui/navigation';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { AppointmentForm } from '@/components/AppointmentForm';

interface NavbarLink {
	text: string;
	href: string;
}

interface NavbarActionProps {
	text: string;
	href: string;
	variant?: ButtonProps['variant'];
	icon?: ReactNode;
	iconRight?: ReactNode;
	isButton?: boolean;
}

interface NavbarProps {
	logo?: ReactNode;
	name?: string;
	homeUrl?: string;
	mobileLinks?: NavbarLink[];
	actions?: NavbarActionProps[];
	showNavigation?: boolean;
	customNavigation?: ReactNode;
	className?: string;
}

export default function Navbar({
	logo = <LaunchUI />,
	name = 'WTeeth',
	homeUrl = '/',
	mobileLinks = [
		{ text: 'appointment', href: '/appointments' },
		{ text: 'patients', href: '/patients' },
		{ text: 'storage', href: '/storage' },
		{ text: 'income', href: '/income' },
	],
	actions = [{ text: 'Sign in', href: '/sign-in', isButton: false }],
	showNavigation = true,
	customNavigation,
	className,
}: NavbarProps) {
	const { data: session, status } = useSession();

	return (
		<header className={cn('sticky top-0 z-50  px-4 pb-2', className)}>
			<div className='fade-bottom bg-accent/15 absolute left-0 h-16 w-full backdrop-blur-lg'></div>
			<div className='max-w-container relative mx-auto'>
				<NavbarComponent>
					<NavbarLeft>
						<a
							href={homeUrl}
							className='flex items-center gap-2 text-xl font-bold'>
							{logo}
							{name}
						</a>
						{showNavigation && (customNavigation || <Navigation />)}
					</NavbarLeft>
					<NavbarRight>
						{actions.map((action, index) =>
							action.isButton ? (
								<Button
									key={index}
									variant={action.variant || 'default'}
									asChild>
									<a href={action.href}>
										{action.icon}
										{action.text}
										{action.iconRight}
									</a>
								</Button>
							) : (
								status === 'unauthenticated' && (
									<a
										key={index}
										href={action.href}
										className='hidden font-bold uppercase text-sm lg:block'>
										{action.text}
									</a>
								)
							)
						)}
						{status === 'authenticated' && (
							<>
								<AppointmentForm />
								<Button
									type='button'
									variant={'destructive'}
									onClick={() => {
										signOut();
										redirect('/sign-in');
									}}
									className='hidden uppercase !text-xs lg:block !p-2 h-7'>
									Sign out
								</Button>
							</>
						)}
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									className='shrink-0 lg:hidden'>
									<Menu className='size-5' />
									<span className='sr-only'>Toggle navigation menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side='right'>
								<nav className='grid gap-6 text-lg font-medium items-between'>
									<a
										href={homeUrl}
										className='flex items-center gap-2 text-xl font-bold'>
										<span>{name}</span>
									</a>
									{mobileLinks.map((link, index) => (
										<a
											key={index}
											href={link.href}
											className='text-muted-foreground hover:text-foreground'>
											{link.text}
										</a>
									))}
									<div className='flex flex-col gap-2'>
										{actions.map((action, index) =>
											action.isButton ? (
												<Button
													key={index}
													variant={action.variant || 'default'}
													asChild>
													<a href={action.href}>
														{action.icon}
														{action.text}
														{action.iconRight}
													</a>
												</Button>
											) : (
												status === 'unauthenticated' && (
													<a
														key={index}
														href={action.href}
														className=' font-bold uppercase text-sm'>
														{action.text}
													</a>
												)
											)
										)}
										{status === 'authenticated' && (
											<Button
												type='button'
												variant={'destructive'}
												onClick={() => {
													signOut();
													redirect('/sign-in');
												}}
												className='uppercase !text-xs !p-2 h-7'>
												Sign out
											</Button>
										)}
									</div>
								</nav>
							</SheetContent>
						</Sheet>
					</NavbarRight>
				</NavbarComponent>
			</div>
		</header>
	);
}
