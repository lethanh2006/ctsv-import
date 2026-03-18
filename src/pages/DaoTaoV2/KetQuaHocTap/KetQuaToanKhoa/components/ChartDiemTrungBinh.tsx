import LineChart from '@/components/Chart/LineChart';
import { useIntl, useModel } from 'umi';

const ChartDiemTrungBinh = () => {
	const intl = useIntl();
	const { danhSach } = useModel('daotaov2.ketquahoctap.ketquahocky');

	return (
		<LineChart
			xAxis={danhSach.map((item) => item.maHocKy)}
			yAxis={[
				danhSach.map((item) => item.trungBinhHocKyThang4),
				danhSach.map((item) => item.trungBinhTichLuyToanKhoaThang4),
			]}
			yLabel={[
				intl.formatMessage({ id: 'sinhvienhocvu.chart.tbhocky' }),
				intl.formatMessage({ id: 'sinhvienhocvu.chart.tbtichluy' }),
			]}
			colors={['#0982c9', '#18b903']}
			title={intl.formatMessage({ id: 'sinhvienhocvu.chart.title.diem' })}
			formatY={(val) => (Math.round(val * 100) / 100).toString()}
			height={300}
			otherOptions={{ yaxis: { min: 0, max: 4, tickAmount: 4 } }}
		/>
	);
};

export default ChartDiemTrungBinh;
