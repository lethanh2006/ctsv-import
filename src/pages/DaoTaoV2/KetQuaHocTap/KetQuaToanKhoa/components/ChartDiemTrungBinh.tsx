import LineChart from '@/components/Chart/LineChart';
import { useIntl, useModel } from 'umi';

const ChartDiemTrungBinh = (props: { legendBottom?: boolean }) => {
	const intl = useIntl();
	const { danhSach } = useModel('daotaov2.ketquahoctap.ketquahocky');
	const { legendBottom } = props;

	return (
		<LineChart
			xAxis={danhSach.map((item) => item.maHocKy)}
			yAxis={[
				danhSach.map((item) => item.trungBinhHocKyThang4 ?? 0),
				danhSach.map((item) => item.trungBinhTichLuyToanKhoaThang4 ?? 0),
			]}
			yLabel={[
				intl.formatMessage({ id: 'sinhvienhocvu.chart.tbhocky' }),
				intl.formatMessage({ id: 'sinhvienhocvu.chart.tbtichluy' }),
			]}
			colors={['#0982c9', '#18b903']}
			title={intl.formatMessage({ id: 'sinhvienhocvu.chart.title.diem' })}
			formatY={(val) => (Math.round(val * 100) / 100).toString()}
			height={300}
			otherOptions={{
				yaxis: { min: 0, max: 4, tickAmount: 4 },
				legend: { position: legendBottom ? 'bottom' : 'right' },
				responsive: [
					{
						breakpoint: 1600, //xxl
						options: { legend: { horizontalAlign: 'center', position: 'bottom' } },
					},
				],
			}}
		/>
	);
};

export default ChartDiemTrungBinh;
