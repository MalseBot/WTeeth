"use client";

import Link from "next/link";
import * as React from "react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import LaunchUI from "../logos/launch-ui";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import { useTranslations } from "next-intl";

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode;
}

interface NavigationProps {
  menuItems?: MenuItem[];
  essentials?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
	menuItems = [
		{
			title: 'dashboard',
			content: 'default',
		},
		{
			title: 'essentials',
			content: 'essentials',
		},
	],
	essentials = [
		{
			title: 'storage',
			href: '/storage',
			description:
      "storageDesc",
    },
		{
			title: 'budget',
			href: '/budget',
			description:
      "budgetDesc",
    },
	],
	logo = <LaunchUI />,
	logoTitle = 'WHealth',
	logoDescription ='logoDecription',
	logoHref = 'https://www.launchuicomponents.com/',
	introItems = [
		{
			title: 'appointments',
			href: '/appointments',
			description: 'appointmentDesc',
		},
		{
			title: 'patients',
			href: '/patients',
			description: 'patientsDesc',
		},
	],
}: NavigationProps) {
	const t = useTranslations('navigation');
	return (
		<NavigationMenu className='hidden lg:flex'>
			<NavigationMenuList>
				{menuItems.map((item, index) => (
					<NavigationMenuItem key={index}>
						{item.isLink ? (
							<Link
								href={item.href || ''}
								passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									{t(item.title)}
								</NavigationMenuLink>
							</Link>
						) : (
							<>
								<NavigationMenuTrigger className=' font-bold'>
									{t(item.title)}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									{item.content === 'default' ? (
										<ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
											<li className='row-span-3'>
												<NavigationMenuLink asChild>
													<a
														className='from-muted/30  to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md'
														href={logoHref}>
														{logo}
														<div className='mt-4 mb-2 text-lg font-medium'>
															{logoTitle}
														</div>
														<p className='text-muted-foreground text-sm leading-tight'>
															{t(logoDescription)}
														</p>
													</a>
												</NavigationMenuLink>
											</li>
											{introItems.map((intro, i) => (
												<ListItem
													key={i}
													href={intro.href}
													title={t(intro.title)}>
													{t(intro.description)}
												</ListItem>
											))}
										</ul>
									) : item.content === 'essentials' ? (
										<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
											{essentials.map((component) => (
												<ListItem
													key={component.title}
													title={t(component.title)}
													href={component.href}>
													{t(component.description)}
												</ListItem>
											))}
										</ul>
									) : (
										item.content
									)}
								</NavigationMenuContent>
							</>
						)}
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none uppercase font-semibold">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
