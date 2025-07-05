/** @format */

import { StarFilledIcon } from "@radix-ui/react-icons";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex min-h-screen w-full flex-col items-start '>
            <h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex justify-between items-center'>
                            <StarFilledIcon
                                width={25}
                                height={25}
                                className='mx-1 text-yellow-300 '
                            />
                            Appointments
                        </h1>
			{children}
		</div>
	);
}
