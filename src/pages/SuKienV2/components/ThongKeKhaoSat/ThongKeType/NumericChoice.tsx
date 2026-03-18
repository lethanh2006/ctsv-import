import DonutChart from '@/components/Chart/DonutChart';
import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { inputFormat } from '@/utils/utils';

const ThongKeNumericChoice = (props: { ketQua: BieuMau.ThongKeLuaChonNumeric[] }) => {
	const { ketQua } = props;
	return (
		<>
			<DonutChart
				xAxis={ketQua?.map((item) => `Giá trị ${item?.giaTriTuyenTinh}`)}
				yAxis={[ketQua?.map((item) => item?.soLuong)]}
				yLabel={['Lựa chọn']}
				showTotal
				formatY={(val) => `${inputFormat(val)} lựa chọn`}
				otherOptions={{ legend: { position: 'bottom' } }}
			/>
		</>
	);
};

export default ThongKeNumericChoice;
