/** @format */

'use client';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import LaunchUI from '../../logos/launch-ui';
import { Button } from '../../ui/button';
import {
	Navbar as NavbarComponent,
	NavbarLeft,
	NavbarRight,
} from '../../ui/navbar';
import Navigation from '../../ui/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../../ui/sheet';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from 'next-intl';

interface NavbarLink {
	text: string;
	href: string;
}

interface NavbarActionProps {
	text: string;
	href: string;
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
		{ text: 'appointments', href: '/appointments' },
		{ text: 'patients', href: '/patients' },
		{ text: 'storage', href: '/storage' },
		{ text: 'budget', href: '/budget' },
	],
	actions = [{ text: 'signIn', href: '/sign-in', isButton: false }],
	showNavigation = true,
	customNavigation,
	className,
}: NavbarProps) {
	const t = useTranslations('navbar');
	const { data: session, status } = useSession();

	return (
		<header className={cn('sticky top-0 z-50  px-4 pb-2', className)}>
			<div className='fade-bottom bg-accent/15 absolute left-0 h-16 w-full backdrop-blur-lg'></div>
			<div className='max-w-container relative mx-auto'>
				<NavbarComponent>
					<NavbarLeft>
						<a
							href={homeUrl}
							className='flex uppercase items-center gap-2  text-xl font-bold'>
							{logo}
							{name}
						</a>
						{showNavigation && (customNavigation || <Navigation />)}
					</NavbarLeft>
					<NavbarRight>
						<LocaleSwitcher />
						{actions.map((action, index) =>
							action.isButton ? (
								<Button
									key={index}
									className='inline-flex px-2 py-1.5 font-semibold cursor-pointer items-center justify-center whitespace-nowrap rounded-bl-md rounded-tr-md transform duration-300 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow-sm dark:hover:from-secondary/80 hover:from-secondary/70 dark:hover:to-secondary/70 hover:to-secondary/90 bg-linear-to-b from-secondary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary'
									asChild>
									<a href={action.href}>
										{action.icon}
										{t(action.text)}
										{action.iconRight}
									</a>
								</Button>
							) : (
								status === 'unauthenticated' && (
									<a
										key={index}
										href={action.href}
										className='inline-flex text-primary-foreground px-2 py-1.5 font-semibold cursor-pointer items-center justify-center whitespace-nowrap rounded-bl-md rounded-tr-md transform duration-300 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-secondary-foreground shadow-sm dark:hover:from-secondary/80 hover:from-secondary/70 dark:hover:to-secondary/70 hover:to-secondary/90 bg-linear-to-b from-secondary/60 to-secondary/100 dark:from-secondary/100 dark:to-primary/70 border-t-primary'>
										{t(action.text)}
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
									className='inline-flex px-2 py-1.5 font-semibold cursor-pointer items-center justify-center whitespace-nowrap rounded-bl-md rounded-tr-md transform duration-300 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow-sm dark:hover:from-secondary/80 hover:from-secondary/70 dark:hover:to-secondary/70 hover:to-secondary/90 bg-linear-to-b from-secondary/60 to-primary/100 dark:from-destructive/100 dark:to-destructive/70 border-t-destructive'>
									{t('signOut')}
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
								<SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
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
											className='text-muted-foreground border-b duration-500 font-semibold uppercase hover:text-foreground'>
											{t(link.text)}
										</a>
									))}
									<div className='flex flex-col gap-2'>
										{actions.map((action, index) =>
											action.isButton ? (
												<Button
													key={index}
													asChild>
													<a href={action.href}>
														{action.icon}
														{t(action.text)}
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
												{t('signOut')}
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
