import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import LaunchUI from "../../logos/launch-ui";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function FooterSection({
  
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
		<footer className={cn(' w-full px-4', className)}>
			<div className='max-w-container mx-auto'>
				<Footer>
					<FooterBottom>
						<div className='flex items-center gap-4'>
							{showModeToggle && <ModeToggle />}
							<p>
								Developed by Eslam Hassanin Email: eslamhassanin24@gmail.com ©
								2024 All Rights Reserved
							</p>
						</div>
					</FooterBottom>
				</Footer>
			</div>
		</footer>
	);
}
