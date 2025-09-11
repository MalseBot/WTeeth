/** @format */

import ItemAmount from '@/components/ItemAmount';
import PieCard from '@/components/PieCard';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

import {
	getAppointmentsByDateRange,
	getStorage,
	getTotalBudget,
	getTotalExpense,
	getTotalIncome,
} from '@/lib/fetching';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { endOfToday, formatDate, getTime, startOfToday } from 'date-fns';

export default async function Home() {
	  const t = await getTranslations("Dashboard");

	const appointments = await getAppointmentsByDateRange(
		startOfToday(),
		endOfToday()
	);
	const time = formatDate(getTime(new Date()), 'MMM E h:mm a');

	const totalIncome = await getTotalIncome();
	const totalExpense = await getTotalExpense();
	const totalBudget = await getTotalBudget();

	const storage = await getStorage();

	return (
		<div className='m-5 min-h-screen gap-y-10 flex flex-col'>
			<div className='flex justify-between text-3xl uppercase'>
				<h1 className=' text-primary font-bold border-b border-s w-fit flex items-center'>
					<StarFilledIcon
						width={25}
						height={25}
						className='mx-1 text-yellow-300 '
					/>
					{t("title")}
				</h1>
				<p className='bg-primary !text-primary-foreground shadow p-2 rounded-tr-2xl rounded-bl-2xl font-semibold '>
					<span className=' font-bold'>{time}</span>
				</p>
			</div>
			<section className='m-5'>
				<Card className='w-3/4 text-center m-auto rounded-tr-2xl pt-0 border-0 rounded-bl-2xl'>
					<CardTitle className='rounded-tr-2xl bg-accent text-accent-foreground p-5 shadow-2xs font-semibold rounded-bl-2xl'>
						{t("appointments")}
					</CardTitle>
					<CardContent className='rounded-bl-2xl '>
						{appointments.map(async (e) => (
							<div
								key={e.id}
								className=' p-3 bg-secondary w-fit font-bold text-secondary-foreground rounded-tr-2xl rounded-bl-2xl shadow'>
								{e.patientName.slice(0, 15)} {formatDate(e.date, 'h:mm a')}
							</div>
						))}
					</CardContent>
				</Card>
			</section>
			<section className='grid md:grid-cols-2 gap-2'>
				<PieCard
					totalBudget={totalBudget}
					totalIncome={totalIncome}
					totalExpense={totalExpense}
				/>
				<div className='p-3 w-full bg-accent-foreground/50 h-fit flex flex-col rounded-tr-2xl rounded-bl-2xl shadow'>
					<h3 className='text-primary text-xl font-semibold'>{t("storage")}</h3>
					<div className='grid lg:grid-cols-2 grid-cols-1'>
						{storage.map((e) => (
							<div
								key={e.id}
								className=' '>
								<p className='text-lg font-semibold text-secondary-foreground'>
									{e.name}
								</p>
								<ItemAmount e={e} />
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
