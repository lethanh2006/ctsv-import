import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type SuKienV2 } from '@/services/SuKienV2/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { Button, Empty, Modal, Spin } from 'antd';
import { useIntl, useModel } from 'umi';

export const ThongKeNguoiThamDu = () => {
	const intl = useIntl();
	const { isLoadingThongKeTheoSuKien, thongKeTheoSuKienData, setIsVisibleThongKe, isVisibleThongKe, record } =
		useModel('sukienv2');

	const tongNguoiDaThamDu = thongKeTheoSuKienData?.tongNguoiDaThamDu ?? 0;
	const tongNguoiChuaThamDu = (thongKeTheoSuKienData?.tongusers ?? 0) - tongNguoiDaThamDu;

	const columns: IColumn<SuKienV2.IUser>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.thongke.ma' }),
			dataIndex: 'code',
			width: 80,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sukien.thongke.hoten' }),
			width: 150,
			dataIndex: 'fullname',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sukien.thongke.vaitro' }),
			width: 150,
			dataIndex: 'vaiTro',
			filterType: 'select',
			filterData: Object.values(EVaiTroBieuMau).map((item) => ({ value: item, label: TenVaiTroBieuMau[item] })),
			render: (_, rec) => (rec.vaiTro ? TenVaiTroBieuMau[rec.vaiTro] : null),
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.thongke.thamgia' }),
			width: 150,
			dataIndex: 'thamGia',
			align: 'center',
			filterType: 'select',
			filterData: [
				{ value: true, label: intl.formatMessage({ id: 'sukien.thongke.thamgia.dathamgia' }) },
				{ value: false, label: intl.formatMessage({ id: 'sukien.thongke.thamgia.chuthamgia' }) },
			],
			render: (_, rec) => {
				if (rec.thamGia) {
					return intl.formatMessage({ id: 'sukien.thongke.thamgia.dathamgia' });
				}
				return intl.formatMessage({ id: 'sukien.thongke.thamgia.chuthamgia' });
			},
		},
	];

	const renderContent = () => {
		if (!isLoadingThongKeTheoSuKien && !thongKeTheoSuKienData) {
			return <Empty description={intl.formatMessage({ id: 'sukien.thongke.empty' })} />;
		}
		// if (thongKeTheoSuKienData?.tongusers === 0) {
		// 	return (
		// 		<Descriptions column={1}>
		// 			<Descriptions.Item label='Tổng số người tham gia'>Tất cả</Descriptions.Item>
		// 			<Descriptions.Item label='Số người đã tham gia'>{thongKeTheoSuKienData.tongNguoiDaThamDu}</Descriptions.Item>
		// 		</Descriptions>
		// 	);
		// }
		return (
			<Spin spinning={isLoadingThongKeTheoSuKien}>
				<DonutChart
					showTotal
					height={300}
					xAxis={[
						intl.formatMessage({ id: 'sukien.thongke.nguoidathamdu' }),
						intl.formatMessage({ id: 'sukien.thongke.nguoichuathamdu' }),
					]}
					yAxis={[[tongNguoiDaThamDu, tongNguoiChuaThamDu]]}
					yLabel={[intl.formatMessage({ id: 'sukien.thongke.nguoithamdu' })]}
					formatY={(vsl) => vsl.toString()}
				/>
				<TableStaticData addStt data={thongKeTheoSuKienData?.danhSach ?? []} columns={columns} />
				<div style={{ textAlign: 'center' }}>
					<Button onClick={() => setIsVisibleThongKe(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Spin>
		);
	};

	return (
		<Modal
			width={900}
			title={intl.formatMessage({ id: 'sukien.thongke.title' }, { tenSuKien: record?.tenSuKien })}
			open={isVisibleThongKe}
			footer={null}
			onCancel={() => setIsVisibleThongKe(false)}
		>
			{renderContent()}
		</Modal>
	);
};
