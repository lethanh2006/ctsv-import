import DonutChart from '@/components/Chart/DonutChart';
import { Empty } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ChartCongNoSinhVien = () => {
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { dataThongKe, getThongKeCongNoModel } = useModel('daotaov2.taichinh.hoadon');

	useEffect(() => {
		if (recSinhVien?.ssoId) getThongKeCongNoModel(recSinhVien.ssoId);
	}, [recSinhVien?.ssoId]);

	if (!dataThongKe?.totalAmountPaid && !dataThongKe?.totalAmountRemaining)
		return <Empty description='Không có thông tin công nợ' style={{ marginTop: 50, marginBottom: 32 }} />;
	return (
		<DonutChart
			yAxis={[[dataThongKe?.totalAmountPaid ?? 0, dataThongKe?.totalAmountRemaining ?? 0]]}
			xAxis={['Đã nộp', 'Chưa nộp']}
			yLabel={['Số tiền']}
			height={320}
			showTotal
			otherOptions={{
				legend: {
					position: 'bottom',
					horizontalAlign: 'center',
				},
			}}
		/>
	);
};

export default ChartCongNoSinhVien;
