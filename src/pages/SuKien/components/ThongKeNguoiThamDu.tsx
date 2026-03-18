import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type SuKien } from '@/services/SuKien/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { Button, Descriptions, Empty, Modal, Spin } from 'antd';
import { useModel } from 'umi';

export const ThongKeNguoiThamDu = () => {
	const { isLoadingThongKeTheoSuKien, thongKeTheoSuKienData, setIsVisibleThongKe, isVisibleThongKe, record } =
		useModel('sukien');

	const tongNguoiDaThamDu = thongKeTheoSuKienData?.tongNguoiDaThamDu ?? 0;
	const tongNguoiChuaThamDu = (thongKeTheoSuKienData?.tongusers ?? 0) - tongNguoiDaThamDu;

	const columns: IColumn<SuKien.IUser>[] = [
		{
			title: 'Mã cán bộ',
			dataIndex: 'code',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			width: 150,
			dataIndex: 'fullname',
			filterType: 'string',
		},
		{
			title: 'Vai trò',
			width: 150,
			dataIndex: 'vaiTro',
			filterType: 'select',
			filterData: Object.values(EVaiTroBieuMau).map((item) => ({ value: item, label: TenVaiTroBieuMau[item] })),
			render: (_, rec) => (rec.vaiTro ? TenVaiTroBieuMau[rec.vaiTro] : null),
			align: 'center',
		},
		{
			title: 'Trạng thái tham gia',
			width: 150,
			dataIndex: 'thamGia',
			align: 'center',
			filterType: 'select',
			filterData: [
				{ value: true, label: 'Đã tham gia' },
				{ value: false, label: 'Chưa tham gia' },
			],
			render: (_, rec) => {
				if (rec.thamGia) {
					return 'Đã tham gia';
				}
				return 'Chưa tham gia';
			},
		},
	];

	const renderContent = () => {
		if (!isLoadingThongKeTheoSuKien && !thongKeTheoSuKienData) {
			return <Empty description='Không có dữ liệu' />;
		}
		if (thongKeTheoSuKienData?.tongusers === 0) {
			return (
				<Descriptions column={1}>
					<Descriptions.Item label='Tổng số người tham gia'>Tất cả</Descriptions.Item>
					<Descriptions.Item label='Số người đã tham gia'>{thongKeTheoSuKienData.tongNguoiDaThamDu}</Descriptions.Item>
				</Descriptions>
			);
		}
		return (
			<Spin spinning={isLoadingThongKeTheoSuKien}>
				<DonutChart
					showTotal
					height={300}
					xAxis={['Người đã tham dự', 'Người chưa tham dự']}
					yAxis={[[tongNguoiDaThamDu, tongNguoiChuaThamDu]]}
					yLabel={['Người tham dự']}
					formatY={(vsl) => vsl.toString()}
				/>
				<TableStaticData addStt data={thongKeTheoSuKienData?.danhSach ?? []} columns={columns} />
				<div style={{ textAlign: 'center' }}>
					<Button onClick={() => setIsVisibleThongKe(false)}>Đóng</Button>
				</div>
			</Spin>
		);
	};

	return (
		<Modal
			width={900}
			title={`Thống kê người tham dự ${record?.tenSuKien}`}
			open={isVisibleThongKe}
			footer={null}
			onCancel={() => setIsVisibleThongKe(false)}
		>
			{renderContent()}
		</Modal>
	);
};
