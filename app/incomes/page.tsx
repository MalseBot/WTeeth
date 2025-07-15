/** @format */

import ChartCard from '@/components/ChartsCard';
import InfoTable from '@/components/sections/InfoTable';

import {
	updateIncome,
	getBudgetExpense,
	getBudgetIncome,
	getTotalExpense,
	getAllbudget,
	getTotalBudget,
} from '@/lib/fetching';
import React from 'react';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const page = async () => {
	const totalbudget = await getTotalBudget();
	const budgetData = await getAllbudget();
	
	await updateIncome();
	const now = new Date();

	const income = await getBudgetIncome();
	const expense = await getBudgetExpense();

	const totalExpense = await getTotalExpense();

	return (
		<div className='grid lg:grid-cols-2 grid-cols-1 items-start gap-5 m-10'>
			<h1 className='text-3xl  uppercase text-primary font-bold m-3 border-b border-s w-fit flex justify-between items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				Budget
			</h1>
			<div className='gap-3 flex flex-col '>
				<div className='rounded-tr-3xl flex justify-between rounded-bl-3xl w-full h-fit bg-white p-3 shadow'>
					<p className=' text-md capitalize font-semibold '>
						your income for this month is
					</p>
					<span className='  text-md capitalize font-semibold text-end'>
						{income[0].price} EGP
					</span>
				</div>
				<div className='rounded-tr-3xl flex justify-between rounded-bl-3xl w-full h-fit bg-white p-3 shadow'>
					<p className=' text-md capitalize font-semibold '>
						your expenses for this month is
					</p>
					<span className='  text-md capitalize font-semibold text-end'>
						{totalExpense} EGP
					</span>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Visual Chart</CardTitle>
					<CardDescription className=' font-bold'>
						Showing total Budget information for this month.{' '}
						<span
							className={totalbudget >= 0 ? 'text-accent' : 'text-destructive'}>
							{totalbudget ? ` Total Budget: ${totalbudget} EGP` : ''}
						</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartCard chartData={budgetData} />
				</CardContent>
			</Card>
			<section className='flex justify-center items-center flex-col gap-y-3'>
				<h2 className='text-2xl uppercase font-bold opacity-80 border-b m-5 w-full'>
					expenses history of{' '}
					{now.toLocaleString('en-US', {
						month: 'long',
					})}
				</h2>
				<InfoTable
					rows={expense}
					type='budget'
				/>
			</section>
		</div>
	);
};

export default page;
