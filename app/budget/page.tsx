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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import BudgetForm from '@/components/forms/BudgetForm';
import { getTranslations } from 'next-intl/server';

const page = async () => {
	const totalbudget = await getTotalBudget();
	const budgetData = await getAllbudget();
	const t = await getTranslations('Budget');
	
	await updateIncome();
	const income = await getBudgetIncome();
	const expense = await getBudgetExpense();
	console.log(income);

	const now = new Date();

	const totalExpense = await getTotalExpense();

	return (
		<div className='grid lg:grid-cols-2 grid-cols-1 items-start gap-5 mx-10'>
			<h1 className='text-3xl uppercase text-primary font-bold m-3 border-b border-s w-fit flex justify-between items-center'>
				<StarFilledIcon
					width={25}
					height={25}
					className='mx-1 text-yellow-300 '
				/>
				{t('title')}
			</h1>
			<div className='gap-3 flex flex-col'>
				<div className={`rounded-tr-3xl flex justify-between rounded-bl-3xl w-full h-fit bg-white p-3 shadow`}>
					<p className='text-md capitalize font-semibold'>{t('income')}</p>
					<span className='text-md capitalize font-semibold text-end'>
						{income?.price}
						{t('currency')}
					</span>
				</div>
				<div className={`rounded-tr-3xl flex justify-between rounded-bl-3xl w-full h-fit bg-white p-3 shadow`}>
					<p className='text-md capitalize font-semibold '>
						{t('expense')}
					</p>
					<span className='text-md capitalize font-semibold text-end'>
						{totalExpense} {t('currency')}
					</span>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Visual Chart</CardTitle>
					<CardDescription className='font-bold'>
						Showing total Budget information for this month.{' '}
						<span
							className={totalbudget >= 0 ? 'text-accent' : 'text-destructive'}>
							{totalbudget ? ` ${t('total'),totalbudget,t('currency')}` : ''}
						</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartCard chartData={budgetData} />
				</CardContent>
			</Card>
			<section className='flex justify-between items-center w-full flex-col gap-y-3'>
				<div className='flex justify-between items-center w-full'>
					<h2 className='text-2xl uppercase font-bold opacity-80 border-b m-5 w-full'>
						{t('totalExpense')} - 
						{now.toLocaleString('en-US', {
							month: 'long',
						})}
					</h2>
					<BudgetForm />
				</div>
				<InfoTable
					rows={expense}
					type='budget'
				/>
			</section>
		</div>
	);
};

export default page;
