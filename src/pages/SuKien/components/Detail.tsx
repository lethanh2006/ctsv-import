import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import TableSelectNhanSu from '@/pages/ThongBao/components/TableSelectNhanSu';
import TableSelectSinhVien from '@/pages/ThongBao/components/TableSelectSinhVien';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import {
	ELoaiSoLuong,
	EReceiverType,
	ETrangThaiDienRaMappingToTagColor,
	ETrangThaiDienRaMappingToTagLabel,
	LoaiDoiTuongThamGia,
} from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { inputFormat, tienVietNam } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tabs, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

export const Detail = () => {
	const { deleteModel, handleEdit, setIsVisibleFormDetail, record, isVisibleFormDetail, getModel } = useModel('sukien');

	const [activeKey, setActiveKey] = useState<string | undefined>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKien.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKien.IUser[]>([]);

	const roles = record?.roles?.length ? record?.roles : record?.filter?.roles;
	const danhSachDoiTuong = [
		...(record?.filter?.idKhoa ?? []),
		...(record?.filter?.idKhoaSinhVien ?? []),
		...(record?.filter?.idLopHanhChinh ?? []),
		...(record?.filter?.idLopHocPhan ?? []),
		...(record?.filter?.idNganh ?? []),
	];
	const columns: IColumn<SuKien.IKinhPhiDuTru>[] = [
		{
			title: 'Nội dung',
			width: 200,
			dataIndex: 'noiDung',
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đơn vị tính',
			width: 90,
			dataIndex: 'dvTinh',
			align: 'center',
		},
		{
			title: 'Số lượng',
			// dataIndex: 'soLuong',
			width: 150,
			// align: 'center',
			children: [
				{
					title: 'Người',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGUOI && inputFormat(val)}</>;
					},
				},
				{
					title: 'Ngày',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGAY && inputFormat(val)}</>;
					},
				},
				{
					title: 'Khác',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.KHAC && inputFormat(val)}</>;
					},
				},
			],
		},
		{
			title: 'Lượt',
			dataIndex: 'luot',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phòng',
			dataIndex: 'phong',
			width: 120,
			align: 'center',
		},
		{
			title: 'Định mức',
			dataIndex: 'dinhMuc',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Dự toán',
			dataIndex: 'duToan',
			width: 120,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phân bổ nguồn',
			// dataIndex: 'phanBoNguon',
			width: 300,
			align: 'center',
			children: [
				{
					title: 'NSNN',
					dataIndex: 'nguonNSNN',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Tự chủ',
					dataIndex: 'nguonTuChu',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Vận động tài trợ',
					dataIndex: 'nguonTaiTro',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
			],
		},
		{
			title: 'Tiến độ hoàn thành',
			dataIndex: 'hoanThanh',
			width: 120,
			align: 'center',
			render: (val) => (val ? <Tag color={'green'}>Hoàn thành</Tag> : <Tag color={'red'}>Chưa hoàn thành</Tag>),
		},
		{
			title: 'Chứng từ yêu cầu',
			dataIndex: 'chungTuYeuCau',
			width: 150,
			align: 'center',
		},
		{
			title: 'Ý kiến TCKT',
			dataIndex: 'yKienTCKT',
			width: 200,
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
	];
	useEffect(() => {
		if (isVisibleFormDetail) {
			setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
			setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
			setActiveKey(first(record?.roles ?? []));
		} else {
			setDanhSachNhanSu([]);
			setDanhSachSinhVien([]);
			setActiveKey(undefined);
		}
	}, [record?._id, isVisibleFormDetail]);

	return (
		<Modal
			width={900}
			open={isVisibleFormDetail}
			title='Chi tiết hoạt động'
			destroyOnClose
			onCancel={() => setIsVisibleFormDetail(false)}
			footer={
				<Space wrap>
					<Button
						type='primary'
						onClick={() => {
							handleEdit(record);
							setIsVisibleFormDetail(false);
						}}
						icon={<EditOutlined />}
					>
						Chỉnh sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa hoạt động này không?'
						onConfirm={() => {
							deleteModel(record?._id ?? '', getModel);
							setIsVisibleFormDetail(false);
						}}
					>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>

					<Button onClick={() => setIsVisibleFormDetail(false)}>Đóng</Button>
				</Space>
			}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Trạng thái'>
					{record?.trangThai ? (
						<Tag color={ETrangThaiDienRaMappingToTagColor[record.trangThai]}>
							{ETrangThaiDienRaMappingToTagLabel[record.trangThai]}
						</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Tên hoạt động'>{record?.tenSuKien}</Descriptions.Item>
				<Descriptions.Item label='Địa điểm'>{record?.diaDiem ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Thời gian bắt đầu'>
					{record?.thoiGianBatDau ? dayjs(record?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian kết thúc'>
					{record?.thoiGianKetThuc ? dayjs(record?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Kinh phí'>{record?.kinhPhi ? tienVietNam(record?.kinhPhi) : '--'}</Descriptions.Item>
				<Descriptions.Item label='Số lượng'>{record?.soLuong ?? record?.users?.length ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Mã hoạt động'>
					<Link target='_blank' to={`/qr-su-kien/${record?._id}`}>
						{record?.maSuKien}
					</Link>
				</Descriptions.Item>
				{record?.receiverType && (
					<Descriptions.Item label='Đối tượng tham gia'>
						<Space style={{ width: '100%' }} direction='vertical'>
							<div>{LoaiDoiTuongThamGia[record?.receiverType]}</div>
							{record?.receiverType === EReceiverType.Khoa ? (
								<SelectDonVi readOnly value={record.filter?.idKhoa} multiple selectMa />
							) : record?.receiverType === EReceiverType.KhoaSinhVien ? (
								<SelectKhoaSinhVien disabled value={record.filter?.idKhoaSinhVien} multiple />
							) : record?.receiverType === EReceiverType.LopHanhChinh ? (
								<SelectLopHanhChinhDebounce disabled value={record.filter?.idLopHanhChinh} multiple selectMa />
							) : record?.receiverType === EReceiverType.LopHocPhan ? (
								<SelectLopHocPhanDebounce disabled value={record.filter?.idLopHocPhan} multiple selectMa />
							) : record?.receiverType === EReceiverType.Nganh ? (
								<SelectNganhCoSo disabled value={record.filter?.idNganh} multiple />
							) : null}
						</Space>
					</Descriptions.Item>
				)}
				{roles?.length && (
					<Descriptions.Item label='Thành phần'>
						{roles.map((role) => TenVaiTroBieuMau[role]).join('; ')}
					</Descriptions.Item>
				)}
				{!record?.users?.length && <Descriptions.Item label='Danh sách người tham gia'>Tất cả</Descriptions.Item>}
			</Descriptions>
			{record?.users?.length ? (
				<div>
					<Typography.Text strong>Danh sách người tham gia :</Typography.Text>
					<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
						{Object.values(EVaiTroBieuMau).map((item) =>
							roles?.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} /> : null,
						)}
					</Tabs>

					{activeKey === EVaiTroBieuMau.SINH_VIEN ? (
						<TableSelectSinhVien
							readOnly
							selectedUsers={danhSachSinhVien}
							setSelectedUsers={setDanhSachSinhVien}
							danhSachDoiTuong={{ [`id${record?.receiverType}`]: danhSachDoiTuong }}
						/>
					) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
						<TableSelectNhanSu
							readOnly
							selectedUsers={danhSachNhanSu}
							setSelectedUsers={setDanhSachNhanSu}
							danhSachDoiTuong={{ [`id${record?.receiverType}`]: danhSachDoiTuong }}
						/>
					) : null}
				</div>
			) : null}
			{record?.kinhPhiDuTru && record?.kinhPhiDuTru?.length > 0 && (
				<>
					<div style={{ fontSize: 14, fontWeight: 600 }}>Kinh phí dự trù</div>
					<TableStaticData size='small' data={record?.kinhPhiDuTru} addStt columns={columns} />
				</>
			)}
		</Modal>
	);
};
