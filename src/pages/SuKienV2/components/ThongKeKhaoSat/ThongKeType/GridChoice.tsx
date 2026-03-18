// import vi from '@/components/Chart/vi.json';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { type ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

const ThongKeGrid = (props: { ketQua: BieuMau.ThongKeLuaChonGrid[] }) => {
	const { ketQua } = props;

	const xAxis = ketQua?.map((item) => item?.noiDungHang);

	const seriesData = ketQua?.[0]?.thongKeCot?.map((cot) => ({
		name: cot.noiDungCot,
		data: ketQua?.map((item) => item.thongKeCot.find((tc) => tc.idCot === cot.idCot)?.soLuong || 0),
	}));

	const options: ApexOptions = {
		chart: {
			defaultLocale: 'vi',
			// locales: [vi],
			stacked: true,
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			categories: xAxis,
			labels: {
				style: {
					fontSize: '12px',
				},
				formatter: function (value) {
					const maxLength = 10;
					if (value.length > maxLength) {
						return value.substring(0, maxLength) + '...';
					} else {
						return value;
					}
				},
			},
		},
		tooltip: {
			shared: true,
			intersect: false,
			x: {
				formatter: function (value: any) {
					return value;
				},
			} as any,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
			},
		},
		legend: {
			position: 'bottom',
		},
		colors: ['#CC2E45', '#5F65B9', '#66C1DC', '#68BE65', '#FDD100', '#FF9A02'],
	};

	return (
		<>
			<Chart options={options} series={seriesData} type='bar' height={400} />
		</>
	);
};
export default ThongKeGrid;
