// import vi from '@/components/Chart/vi.json';
import { type ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

/** Unused => TO REMOVED */
const ChartKetQua = () => {
	const series = [
		{
			name: 'Số TC đạt',
			group: 'dat',
			type: 'column',
			data: [20, 29, 37, 36, 44, 45, 50, 58],
		},
		{
			name: 'Số TC tích luỹ',
			group: 'tichluy',
			type: 'column',
			data: [10, 22, 34, 37, 47, 54, 59, 83],
		},
		{
			name: 'Số TC không đạt',
			group: 'dat',
			type: 'column',
			data: [6, 8, 12, 15, 3, 5, 9, 0],
		},
		{
			name: 'Số TC nợ',
			group: 'tichluy',
			type: 'column',
			data: [3, 2, 5, 8, 4, 2, 0, 3],
		},
		{
			name: 'TB học kỳ',
			group: 'dat',
			type: 'line',
			data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
		},
		{
			name: 'TB tích lũy',
			group: 'tichluy',
			type: 'line',
			data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
		},
	];

	const options: ApexOptions = {
		chart: {
			defaultLocale: 'vi',
			// locales: [vi],
			stacked: true,
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 1, 1, 3, 3],
		},
		xaxis: {
			categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
		},
		yaxis: [
			{
				seriesName: 'Số TC đạt',
				axisBorder: {
					show: true,
				},
			},
			{
				seriesName: 'Số TC đạt',
				show: false,
			},
			{
				seriesName: 'Số TC đạt',
				show: false,
			},
			{
				seriesName: 'Số TC đạt',
				show: false,
			},
			{
				seriesName: 'TB tích lũy',
				axisBorder: {
					show: true,
				},
				opposite: true,
			},
			{
				seriesName: 'TB học kỳ',
				show: false,
			},
		],
		responsive: [
			{
				breakpoint: 1600, //xxl
				options: {
					legend: { horizontalAlign: 'center', position: 'bottom' },
					plotOptions: {
						bar: {
							columnWidth: '70%',
						},
					},
				},
			},
		],
		tooltip: {
			shared: true,
			intersect: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
			},
		},
		legend: {
			position: 'right',
		},
		colors: ['#86c4ee', '#a5e03d', '#F3DE2C', '#fc7e4d', '#0982c9', '#18b903'],
	};

	return <Chart options={options} series={series} type='bar' height={400} />;
};

export default ChartKetQua;
