import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ETrangThaiThanhToan } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const NhanPhongKTXPage = () => {
	const intl = useIntl();
	const { page, limit, selectedIds, setSelectedIds, getModel } = useModel('kytucxa.checkinsinhvien');
	const { postModel: checkin } = useModel('kytucxa.confirmcheckin')
	const { danhSach: danhSachPhong, getModel: getPhong } = useModel('kytucxa.phong');
	const { danhSach: danhSachToa, getAllModel: getAllToa } = useModel('kytucxa.toa');
	const { danhSach: danhSachDanhMuc, getAllModel: getAllDanhMuc } = useModel('kytucxa.danhmucchung');
	const { danhSach: danhSachDot, getAllModel: getAllDot } = useModel('kytucxa.dotdangkyktx');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		getPhong();
		getAllToa();
		getAllDanhMuc();
		getAllDot();
	}, []);

	const getValueByPath = (record: any, paths: string[]) => {
		for (const path of paths) {
			const value = path.split('.').reduce((obj, key) => obj?.[key], record);
			if (value !== undefined && value !== null && value !== '') return value;
		}

		return undefined;
	};

	const renderDate = (value?: string | null, format = 'DD/MM/YYYY') => (value ? dayjs(value).format(format) : '--');

	const getPhongInfo = (record: KyTucXa.IThongTinDangKy) =>
		record?.phong || danhSachPhong?.find((item: KyTucXa.IPhong) => item?.ma === record?.maPhong);

	const getLoaiPhong = (record: KyTucXa.IThongTinDangKy) => {
		const phong = getPhongInfo(record);
		const maLoaiPhong =
			phong?.loaiPhongKtx?.ma || phong?.maLoaiPhongKtx;
		const tenLoaiPhong =
			phong?.loaiPhongKtx?.ten ||
			danhSachDanhMuc?.find((item: KyTucXa.IDanhMucChung) => item?.ma === maLoaiPhong)?.ten;

		return tenLoaiPhong || maLoaiPhong || '-';
	};

	const getTenPhong = (record: KyTucXa.IThongTinDangKy) => {
		const phong = getPhongInfo(record);

		return phong?.ten || record?.maPhong || '-';
	};

	const getTang = (record: KyTucXa.IThongTinDangKy) => {
		const phong = getPhongInfo(record);

		return phong?.tangThu ?? '-';
	};

	const getTenToaNha = (record: KyTucXa.IThongTinDangKy) => {
		const tenToaNha =
			danhSachToa?.find((item: KyTucXa.IToa) => item?.ma === record?.phong?.maToaNha)?.ten;

		return tenToaNha || record?.phong?.maToaNha || '-';
	};

	const getDotInfo = (record: KyTucXa.IThongTinDangKy) =>
		danhSachDot?.find((item: KyTucXa.IDotDangKyKTX) => item?._id === record?.maDotId);

	const getNgayNhanPhong = (record: KyTucXa.IThongTinDangKy) => {
		const dot = getDotInfo(record);
		return renderDate(dot?.ngayChuyenVao);
	};

	const getNgayTraPhong = (record: KyTucXa.IThongTinDangKy) => {
		const dot = getDotInfo(record);
		return renderDate(dot?.ngayChuyenRa);
	};

	const renderTrangThaiThanhToan = (val?: string) => {
		const status = val?.toString()?.trim();
		const config = {
			[ETrangThaiThanhToan.CHO_THANH_TOAN]: { color: 'processing', label: intl.formatMessage({ id: 'kytucxa.nhanphong.paymentStatus.choThanhToan' }) },
			[ETrangThaiThanhToan.DA_THANH_TOAN]: { color: 'success', label: intl.formatMessage({ id: 'kytucxa.nhanphong.paymentStatus.daThanhToan' }) },
			[ETrangThaiThanhToan.HUY]: { color: 'error', label: intl.formatMessage({ id: 'kytucxa.nhanphong.paymentStatus.huy' }) },
		}[status as ETrangThaiThanhToan];

		if (!config) return <Tag>{val || '-'}</Tag>;

		return <Tag color={config.color}>{config.label}</Tag>;
	};

	const handleCheckin = async () => {
		if (!selectedIds?.length) return;
		setSubmitting(true);
		try {
			await checkin(
				{ ids: selectedIds } as any,
				getModel,
				false,
				intl.formatMessage({ id: 'kytucxa.nhanphong.checkinSuccess' })
			);
			setSelectedIds(undefined);
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	const columns: IColumn<KyTucXa.IThongTinDangKy>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.maSinhVien' }),
			dataIndex: 'nguoiTaoMa',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.hoTen' }),
			width: 150,
			align: 'center',
			dataIndex: 'nguoiTaoHoTen',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.khoaSinhVien' }),
			dataIndex: 'khoa',
			width: 130,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.nganh' }),
			dataIndex: 'nganh',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.soDienThoai' }),
			dataIndex: 'soDienThoai',
			width: 130,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.email' }),
			dataIndex: 'email',
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.thoiGianDangKy' }),
			dataIndex: 'createdAt',
			width: 150,
			align: 'center',
			sortable: true,
			render: (val) => renderDate(val, 'DD/MM/YYYY HH:mm'),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.loaiPhong' }),
			dataIndex: ['phong','maLoaiPhongKtx'],
			width: 140,
			filterType: 'string',
			render: (_, record) => getLoaiPhong(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.maPhong' }),
			dataIndex: 'maPhong',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.tenPhong' }),
			dataIndex: 'maPhong',
			width: 120,
			filterType: 'string',
			render: (_, record) => getTenPhong(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.tang' }),
			dataIndex: ['phong','tangThu'],
			width: 90,
			align: 'center',
			render: (_, record) => getTang(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.tenToaNha' }),
			dataIndex: ['phong','maToaNha'],
			width: 140,
			filterType: 'string',
			render: (_, record) => getTenToaNha(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.ngayNhanPhong' }),
			width: 140,
			align: 'center',
			render: (_, record) => getNgayNhanPhong(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.ngayTraPhong' }),
			width: 140,
			align: 'center',
			render: (_, record) => getNgayTraPhong(record),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.trangThaiThanhToan' }),
			dataIndex: 'trangThaiThanhToan',
			width: 150,
			align: 'center',
			// filterType: 'select',
			// filterData: ['Unpaid', 'Underpaid', 'Paid'],
			render: (val, record) =>
				renderTrangThaiThanhToan(
					val ||
						getValueByPath(record, [
							'hoaDon.trangThaiThanhToan',
							'bill.trangThaiThanhToan',
							'thanhToan.trangThaiThanhToan',
						]),
				),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.checkinsinhvien'
			title={intl.formatMessage({ id: 'kytucxa.nhanphong.title' })}
			rowSelection
			detailRow={{
				getCheckboxProps: (record: any) => {
					const trangThai =
						record?.trangThaiThanhToan ||
						getValueByPath(record, [
							'hoaDon.trangThaiThanhToan',
							'bill.trangThaiThanhToan',
							'thanhToan.trangThaiThanhToan',
						]);
					return {
						disabled: trangThai !== ETrangThaiThanhToan.DA_THANH_TOAN,
					};
				},
			}}
			buttons={{ create: false }}
			scroll={{ x: 2200 }}
			otherButtons={[
				<Popconfirm
					key='bulk-checkin'
					title={intl.formatMessage(
						{ id: 'kytucxa.nhanphong.confirmCheckinNhieu' },
						{ count: selectedIds?.length ?? 0 },
					)}
					onConfirm={handleCheckin}
					okText={intl.formatMessage({ id: 'kytucxa.nhanphong.xacNhan' })}
					cancelText={intl.formatMessage({ id: 'kytucxa.nhanphong.huy' })}
					disabled={!selectedIds?.length}
				>
					<Button type='primary' icon={<CheckCircleOutlined />} loading={submitting} disabled={!selectedIds?.length}>
						{intl.formatMessage({ id: 'kytucxa.nhanphong.btnCheckinNhieu' }, { count: selectedIds?.length ?? 0 })}
					</Button>
				</Popconfirm>,
			]}
		/>
	);
};

export default NhanPhongKTXPage;
