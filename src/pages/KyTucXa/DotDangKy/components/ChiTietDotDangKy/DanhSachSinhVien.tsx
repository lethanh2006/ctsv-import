import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from '@umijs/max';
import { Tag } from 'antd';
import dayjs from 'dayjs';

const DanhSachSinhVien = () => {
	const { record: recordDot } = useModel('kytucxa.dotdangkyktx');
	const { getModel, page, limit } = useModel('kytucxa.dangkykytucxa');

	const getData = () => {
		if (recordDot?._id) {
			getModel({ maDotId: recordDot._id });
		}
	};

	const columns: IColumn<any>[] = [
		{
			title: 'MSV',
			dataIndex: 'nguoiTaoMa',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'nguoiTaoHoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Khoá',
			dataIndex: 'khoa',
			width: 100,
			render: (val: any) => val || '--',
		},
		{
			title: 'Ngành',
			dataIndex: 'nganh',
			width: 180,
			render: (val: any) => val || '--',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
			render: (val: any) => val || '--',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			render: (val: any) => val || '--',
		},
		{
			title: 'Loại phòng',
			dataIndex: 'phong',
			width: 120,
			render: (phong: any) => phong?.maLoaiPhongKtx || '--',
		},
		{
			title: 'Mã phòng',
			dataIndex: 'maPhong',
			width: 100,
			filterType: 'string',
			render: (val: any) => val || '--',
		},
		{
			title: 'Tên phòng',
			dataIndex: 'phong',
			width: 120,
			render: (phong: any) => phong?.ten || '--',
		},
		{
			title: 'Toà nhà',
			dataIndex: 'phong',
			width: 180,
			render: (phong: any) => phong?.toaNha?.ten || '--',
		},
		{
			title: 'Thời gian đăng ký',
			dataIndex: 'createdAt',
			width: 160,
			render: (val: any) => (val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '--'),
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: 'trangThaiThanhToan',
			width: 160,
			render: (val: any) => {
				switch (val) {
					case 'Paid':
					case 'Đã thanh toán':
						return <Tag color='success'>Đã thanh toán</Tag>;
					case 'Unpaid':
					case 'Chưa thanh toán':
						return <Tag color='error'>Chưa thanh toán</Tag>;
					case 'Underpaid':
					case 'Chưa thanh toán đủ':
						return <Tag color='warning'>Chưa thanh toán đủ</Tag>;
					case 'Closed':
					case 'Đóng':
						return <Tag color='default'>Đóng</Tag>;
					default:
						return <Tag color='default'>{val || 'Chưa thanh toán'}</Tag>;
				}
			},
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit, recordDot?._id]}
			modelName='kytucxa.dangkykytucxa'
			getData={getData}
			buttons={{ create: false }}
		/>
	);
};

export default DanhSachSinhVien;
