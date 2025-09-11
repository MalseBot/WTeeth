/** @format */

'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';
import { useMemo } from 'react';

export const description = 'An area chart with gradient fill';

const chartConfig = {
	income: {
		label: 'income',
		color: 'var(--chart-1)',
	},
	expense: {
		label: 'expense',
		color: 'var(--chart-2)',
	},
} satisfies ChartConfig;

interface ChartDataItem {
	price?: number;
	createdAt: Date | string;
	type: 'income' | 'expense';
}

interface DailyData {
	date: string;
	income: number;
	expense: number;
}

export default function ChartsCard({
	chartData,
}: {
	chartData?: ChartDataItem[];
}) {
	const formattedData =
		chartData?.map((item) => ({
			...item,
			createdAt:
				item.createdAt instanceof Date
					? item.createdAt
					: new Date(item.createdAt),
			income: item.type === 'income' ? item.price : 0,
			expense: item.type === 'expense' ? item.price : 0,
		})) || [];

	const dailyData = formattedData.reduce(
		(acc: Record<string, DailyData>, item) => {
			const dateKey = format(item.createdAt, 'yyyy-MM-dd');

			if (!acc[dateKey]) {
				acc[dateKey] = {
					date: dateKey,
					income: 0,
					expense: 0,
				};
			}

			acc[dateKey].income += item.income || 0;
			acc[dateKey].expense += item.expense || 0;

			return acc;
		},
		{}
	);

	const sortedDailyData = useMemo(()=>Object.values(dailyData).sort(
		(a: DailyData, b: DailyData) =>
			new Date(a.date).getTime() - new Date(b.date).getTime()
	), [dailyData]);

	return (

				<ChartContainer
					className=' w-full'
					config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={sortedDailyData}
						margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickFormatter={(dateStr) => format(new Date(dateStr), 'MMM d')}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<defs>
							<linearGradient
								id='fillDesktop'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='var(--chart-1)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--chart-1)'
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient
								id='fillMobile'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='var(--chart-2)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--chart-2)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							dataKey='expense'
							type='bump'
							fill='url(#fillMobile)'
							fillOpacity={0.4}
							stroke='var(--color-mobile)'
						/>
						<Area
							dataKey='income'
							type='bump'
							fill='url(#fillDesktop)'
							fillOpacity={0.4}
							stroke='var(--color-desktop)'
						/>
					</AreaChart>
				</ChartContainer>

	);
}
