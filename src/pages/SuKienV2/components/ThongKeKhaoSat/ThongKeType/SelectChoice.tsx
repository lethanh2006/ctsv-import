import ColumnChart from '@/components/Chart/ColumnChart';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { inputFormat } from '@/utils/utils';

const ThongKeSelectChoice = (props: { ketQua: BieuMau.ThongKeLuaChon[] }) => {
	const { ketQua } = props;
	return (
		<>
			<ColumnChart
				xAxis={ketQua?.map((item) => item?.noiDungLuaChon)}
				yAxis={[ketQua?.map((item) => item?.soLuong)]}
				yLabel={['Số lượng']}
				height={280}
				formatY={(val) => inputFormat(val ?? 0)}
				colors={['#007EB9']}
				otherOptions={{
					plotOptions: { bar: { columnWidth: '20%' } },
					responsive: [
						{
							breakpoint: 1600,
							options: {
								plotOptions: {
									bar: {
										columnWidth: '40%',
									},
								},
							},
						},
					],
				}}
			/>
		</>
	);
};

export default ThongKeSelectChoice;
