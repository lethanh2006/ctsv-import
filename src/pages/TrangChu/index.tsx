import { unitName } from '@/services/base/constant';
import { Card, Col, Row } from 'antd';
import Chart from 'react-apexcharts';
import { useIntl } from 'umi';
import './components/style.less';

const Home = () => {
	const intl = useIntl();

	const PRIMARY_COLOR = '#C72127';
	const PERCENT_COLOR = '#134D8B';
	const PERCENT_COLOR_LIGHT = '#134D8Bcc';

	const baseChartOptions: ApexCharts.ApexOptions = {
		chart: {
			toolbar: { show: false },
			fontFamily: 'Inter, Roboto, Arial, sans-serif',
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 600,
			},
		},
		grid: {
			borderColor: '#E5E7EB',
			strokeDashArray: 3,
			padding: { left: 12, right: 12 },
		},
		dataLabels: { enabled: false },
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			fontSize: '12px',
		},
		tooltip: {
			theme: 'light',
			style: { fontSize: '12px' },
		},
	};

	const radarOptions: ApexCharts.ApexOptions = {
		...baseChartOptions,
		chart: { type: 'radar' },
		colors: [PERCENT_COLOR],
		stroke: { width: 2 },
		fill: { opacity: 0.18 },
		markers: {
			size: 4,
			colors: [PERCENT_COLOR],
			strokeColors: '#fff',
			strokeWidth: 2,
		},
		xaxis: {
			categories: ['E', 'X', 'C', 'E', 'L'],
			labels: { style: { fontSize: '12px', fontWeight: 500 } },
		},
		yaxis: {
			min: 0,
			max: 100,
			tickAmount: 4,
		},
	};

	const radarSeries = [
		{
			name: 'Achievement Level',
			data: [75, 60, 80, 70, 85],
		},
	];

	const excelStats = [
		{ label: 'E', percent: 80, count: 400 },
		{ label: 'X', percent: 65, count: 325 },
		{ label: 'C', percent: 70, count: 350 },
		{ label: 'E2', percent: 60, count: 300 },
		{ label: 'L', percent: 90, count: 450 },
	];

	const excelOptions: ApexCharts.ApexOptions = {
		...baseChartOptions,
		colors: [PERCENT_COLOR_LIGHT, PRIMARY_COLOR],
		plotOptions: {
			bar: {
				columnWidth: '38%',
				borderRadius: 6,
			},
		},
		stroke: {
			width: [0, 3],
			curve: 'smooth',
		},
		markers: {
			size: 4,
			colors: [PRIMARY_COLOR],
		},
		fill: {
			opacity: [0.85, 1],
		},
		xaxis: {
			categories: excelStats.map((i) => i.label),
			labels: { style: { fontSize: '12px' } },
		},
		yaxis: [
			{
				max: 100,
				title: { text: 'Percentage (%)' },
			},
			{
				opposite: true,
				title: { text: 'Number of Students' },
			},
		],
	};

	const excelSeries = [
		{
			name: 'Percentage (%)',
			type: 'column',
			data: excelStats.map((i) => i.percent),
		},
		{
			name: 'Number of Students',
			type: 'line',
			data: excelStats.map((i) => i.count),
		},
	];

	const facultyStats = [
		{ name: 'Information Technology', percent: 85, count: 420 },
		{ name: 'Economics', percent: 70, count: 350 },
		{ name: 'Mechanical Engineering', percent: 60, count: 300 },
		{ name: 'Electrical & Electronics', percent: 65, count: 325 },
		{ name: 'Civil Engineering', percent: 55, count: 275 },
	];

	const facultyOptions: ApexCharts.ApexOptions = {
		...excelOptions,
		xaxis: {
			categories: facultyStats.map((i) => i.name),
			labels: {
				rotate: -20,
				style: { fontSize: '11px' },
			},
		},
	};

	const facultySeries = [
		{
			name: 'Percentage (%)',
			type: 'column',
			data: facultyStats.map((i) => i.percent),
		},
		{
			name: 'Number of Students',
			type: 'line',
			data: facultyStats.map((i) => i.count),
		},
	];

	const competencyStats = [
		{ name: 'Analytical Thinking', value: 78 },
		{ name: 'Research & Inquiry', value: 72 },
		{ name: 'Systems Thinking', value: 68 },
		{ name: 'Technical Application', value: 80 },
		{ name: 'Data & Evidence-Based Decision Making', value: 74 },
		{ name: 'Creative Problem Solving', value: 82 },
		{ name: 'Design Thinking', value: 76 },
	];

	const competencyOptions: ApexCharts.ApexOptions = {
		...baseChartOptions,
		colors: [PERCENT_COLOR_LIGHT],
		plotOptions: {
			bar: {
				borderRadius: 8,
				columnWidth: '45%',
			},
		},
		xaxis: {
			categories: competencyStats.map((i) => i.name),
			labels: {
				rotate: -35,
				style: { fontSize: '11px' },
			},
		},
		yaxis: {
			max: 100,
			title: { text: 'Achievement Rate (%)' },
		},
		tooltip: {
			y: { formatter: (val) => `${val}%` },
		},
	};

	const competencySeries = [
		{
			name: 'Achievement Rate (%)',
			data: competencyStats.map((i) => i.value),
		},
	];

	const cardProps = {
		size: 'small' as const,
		variant: 'borderless' as const,
		styles: {
			body: { padding: 8 },
			header: { fontWeight: 600, fontSize: 14 },
		},
	};

	return (
		<>
			<Card styles={{ body: { height: '100%' } }} variant='borderless'>
				<div className='home-welcome'>
					<h1 className='title'>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
					<h2 className='sub-title'>
						{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} –{' '}
						{intl.formatMessage({ id: unitName }).toUpperCase()}
					</h2>
				</div>
			</Card>

			<Row gutter={[12, 12]} style={{ marginTop: 12 }}>
				<Col span={24} md={8}>
					<Card title='EXCEL Competency Matrix' {...cardProps}>
						<Chart options={radarOptions} series={radarSeries} type='radar' height={320} />
					</Card>
				</Col>

				<Col span={24} md={16}>
					<Card title='EXCEL Participation Rate' {...cardProps}>
						<Chart options={excelOptions} series={excelSeries} type='line' height={320} />
					</Card>
				</Col>

				<Col span={24} md={12}>
					<Card title='Participation Rate by Faculty' {...cardProps}>
						<Chart options={facultyOptions} series={facultySeries} type='line' height={320} />
					</Card>
				</Col>

				<Col span={24} md={12}>
					<Card title='Skill Achievement Rate by Competency' {...cardProps}>
						<Chart options={competencyOptions} series={competencySeries} type='bar' height={320} />
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default Home;
