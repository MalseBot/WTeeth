/** @format */

'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDate, getMonth, getTime } from 'date-fns';

export const description = 'A donut chart with text';


export default function PieCard({totalBudget,totalIncome,totalExpense}:any) {
    const chartData = [
        { budget: 'income', amount: totalIncome, fill: 'var(--chart-3)' },
        { budget: 'expense', amount: totalExpense, fill: 'var(--chart-4)' },
    ];
    
    const chartConfig = {
        total: {
            label: 'Total earning',
        },
        income: {
            label: 'Income',
            color: 'var(--chart-3)',
        },
        expense: {
            label: 'Expense',
            color: 'var(--chart-4)',
        },
    } satisfies ChartConfig;
	const totalEarnings =totalBudget    
	return (
		<Card className='flex flex-col w-fit'>
			<CardHeader className='items-center pb-0'>
				<CardTitle className='text-xl text-primary'>Earning status for {formatDate(getTime(new Date()), 'MMMM')}</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square !h-[300px]'>
					<PieChart >
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey='amount'
							nameKey='budget'
							innerRadius={50}
							strokeWidth={5}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-xl font-bold'>
													{totalEarnings.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'>
													Earnings
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
