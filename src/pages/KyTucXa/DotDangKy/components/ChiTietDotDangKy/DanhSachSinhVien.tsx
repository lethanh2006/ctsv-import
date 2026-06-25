import TableBase from '@/components/Table';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { useModel } from '@umijs/max';
import { Button, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'umi';

type TSinhVienUuTien = {
	_id: string;
	maSinhVien: string;
	ssoId: string;
	hoTen: string;
	khoaSinhVien: string;
	tenKhoa: string;
	tenNganh: string;
	soDienThoai: string;
	email: string;
	doiTuongUuTien: string;
	urlMinhChung: string;
	ghiChu: string;
};

const MOCK_SINH_VIEN_UU_TIEN: TSinhVienUuTien[] = [
	{
		_id: 'mock-priority-1',
		maSinhVien: 'B21DCCN001',
		ssoId: 'b21dccn001',
		hoTen: 'Nguyễn Minh Anh',
		khoaSinhVien: 'D21',
		tenKhoa: 'Công nghệ thông tin',
		tenNganh: 'Công nghệ thông tin',
		soDienThoai: '0987654321',
		email: 'b21dccn001@stu.ptit.edu.vn',
		doiTuongUuTien: 'Sinh viên thuộc hộ nghèo',
		urlMinhChung: '',
		ghiChu: 'Ưu tiên xét phòng gần khu học tập',
	},
	{
		_id: 'mock-priority-2',
		maSinhVien: 'B22DCVT015',
		ssoId: 'b22dcvt015',
		hoTen: 'Trần Quốc Bảo',
		khoaSinhVien: 'D22',
		tenKhoa: 'Viễn thông',
		tenNganh: 'Kỹ thuật viễn thông',
		soDienThoai: '0978123456',
		email: 'b22dcvt015@stu.ptit.edu.vn',
		doiTuongUuTien: 'Sinh viên khuyết tật',
		urlMinhChung: 'https://example.com/minh-chung-b22dcvt015.pdf',
		ghiChu: '',
	},
	{
		_id: 'mock-priority-3',
		maSinhVien: 'B23DCKT008',
		ssoId: 'b23dckt008',
		hoTen: 'Lê Thu Hà',
		khoaSinhVien: 'D23',
		tenKhoa: 'Tài chính kế toán',
		tenNganh: 'Kế toán',
		soDienThoai: '0966123456',
		email: 'b23dckt008@stu.ptit.edu.vn',
		doiTuongUuTien: 'Sinh viên dân tộc thiểu số',
		urlMinhChung: '',
		ghiChu: 'Sinh viên ở xa',
	},
];

const DanhSachSinhVien = () => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [visibleDanhSachUuTien, setVisibleDanhSachUuTien] = useState(false);
	const [selectedSinhVienUuTienKeys, setSelectedSinhVienUuTienKeys] = useState<React.Key[]>([]);
	const { record: recordDot } = useModel('kytucxa.dotdangkyktx');
	const { getModel, page, limit } = useModel('kytucxa.dangkykytucxa');
	const { danhSach: danhSachLoaiPhong, getAllModel: getAllLoaiPhong } = useModel('kytucxa.loaiphong');

	const getData = () => {
		if (recordDot?._id) {
			getModel({ maDotId: recordDot._id });
			getAllLoaiPhong();
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
			render: (phong: any) =>
				danhSachLoaiPhong?.find((item: KyTucXa.IDanhMucChung) => item?.ma === phong?.maLoaiPhongKtx)?.ten || '-',
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

	const columnsSinhVienUuTien: IColumn<TSinhVienUuTien>[] = [
		{
			title: t('kytucxa.dotdangky.maSinhVien'),
			dataIndex: 'maSinhVien',
			width: 130,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.hoTen'),
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.khoaSinhVien'),
			dataIndex: 'khoaSinhVien',
			width: 140,
		},
		{
			title: t('kytucxa.dotdangky.nganh'),
			dataIndex: 'tenNganh',
			width: 180,
		},
		{
			title: t('kytucxa.dotdangky.soDienThoai'),
			dataIndex: 'soDienThoai',
			width: 130,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, recordDot?._id]}
				modelName='kytucxa.dangkykytucxa'
				getData={getData}
				buttons={{ create: false }}
				otherButtons={[
					<Button key='them-sinh-vien-uu-tien' type='primary' onClick={() => setVisibleDanhSachUuTien(true)}>
						{t('kytucxa.dotdangky.themMoi')}
					</Button>,
				]}
				hideCard
			/>

			<Modal
				open={visibleDanhSachUuTien}
				onCancel={() => setVisibleDanhSachUuTien(false)}
				title={t('kytucxa.dotdangky.danhSachSinhVienUuTien')}
				width={1200}
				footer={null}
				destroyOnClose
			>
				<TableStaticData
					data={MOCK_SINH_VIEN_UU_TIEN}
					columns={columnsSinhVienUuTien}
					size='small'
					addStt
					hasTotal
					otherProps={{
						rowKey: '_id',
						rowSelection: {
							selectedRowKeys: selectedSinhVienUuTienKeys,
							onChange: (selectedRowKeys) => setSelectedSinhVienUuTienKeys(selectedRowKeys),
						},
						pagination: { pageSize: 10 },
						scroll: { x: 1700 },
					}}
				/>

				<div className='form-footer'>
					<Button type='primary'>{t('global.button.themmoi')}</Button>
					<Button htmlType='button' onClick={() => setVisibleDanhSachUuTien(false)}>
						{t('kytucxa.dotdangky.quayLai')}
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default DanhSachSinhVien;
