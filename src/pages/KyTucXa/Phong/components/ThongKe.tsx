import StatisticsCard from '@/components/StatisticsCard';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKePhongKTX = (props: { isDanhSach?: boolean }) => {
	const { isDanhSach } = props;
	const intl = useIntl();
	const { dataThongKe, loadingThongKe, thongKePhongKTXModel } = useModel('kytucxa.phong');

	useEffect(() => {
		thongKePhongKTXModel();
	}, []);

	const tongSoPhong = dataThongKe?.tongQuan?.tongSoPhong ?? 120;
	const soPhongActive = dataThongKe?.tongQuan?.soLuongPhongChoThue ?? 96;
	const soPhongInactive = Math.max(tongSoPhong - soPhongActive, 0);
	const tongSucChua = dataThongKe?.tongQuan?.tongSucChua ?? 480;
	const sinhVienDangO = dataThongKe?.tongQuan?.soLuongSinhVienDaDangKy ?? 365;
	const choConTrong = dataThongKe?.tongQuan?.soLuongChoConTrong ?? Math.max(tongSucChua - sinhVienDangO, 0);

	const statData = isDanhSach
		? [
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSoPhong' }),
					value: tongSoPhong,
					valueColor: '#1890ff',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSucChua' }),
					value: tongSucChua,
					valueColor: '#722ed1',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.sinhVienDangO' }),
					value: sinhVienDangO,
					valueColor: '#fa8c16',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.choConTrong' }),
					value: choConTrong,
					valueColor: '#f5222d',
				},
			]
		: [
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSoPhong' }),
					value: tongSoPhong,
					valueColor: '#1890ff',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.phongActive' }),
					value: soPhongActive,
					valueColor: '#52c41a',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.phongInactive' }),
					value: soPhongInactive,
					valueColor: '#8c8c8c',
				},
				{
					title: intl.formatMessage({ id: 'kytucxa.phong.thongke.tongSucChua' }),
					value: tongSucChua,
					valueColor: '#722ed1',
				},
			];

	return (
		<StatisticsCard
			data={statData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 6 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default ThongKePhongKTX;
