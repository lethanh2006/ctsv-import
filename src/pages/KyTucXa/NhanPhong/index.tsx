import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import axios from '@/utils/axios';
import dayjs from '@/utils/dayjs';
import { ipCsvc } from '@/utils/ip';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const NhanPhongKTXPage = () => {
	const intl = useIntl();
	const { page, limit, selectedIds, setSelectedIds, getModel } = useModel('kytucxa.checkinsinhvien');
	const { danhSach: danhSachPhong, getModel: getPhong } = useModel('kytucxa.phong');
	const { danhSach: danhSachToa, getAllModel: getAllToa } = useModel('kytucxa.toa');
	const { danhSach: danhSachDanhMuc, getAllModel: getAllDanhMuc } = useModel('kytucxa.danhmucchung');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		getPhong();
		getAllToa();
		getAllDanhMuc();
	}, []);

	const getValueByPath = (record: any, paths: string[]) => {
		for (const path of paths) {
			const value = path.split('.').reduce((obj, key) => obj?.[key], record);
			if (value !== undefined && value !== null && value !== '') return value;
		}

		return undefined;
	};

	const renderText = (value?: string | number | null) => value ?? '-';

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

	const renderTrangThaiThanhToan = (val?: string) => {
		const status = val?.toString()?.trim()?.toLowerCase();
		const statusMap: Record<string, { color: string; label: string }> = {
			unpaid: { color: 'red', label: 'Unpaid' },
			underpaid: { color: 'orange', label: 'Underpaid' },
			paid: { color: 'green', label: 'Paid' },
		};
		const config = status ? statusMap[status] : undefined;

		if (!config) return <Tag>{val || '-'}</Tag>;

		return <Tag color={config.color}>{config.label}</Tag>;
	};

	const handleBulkCheckin = async () => {
		if (!selectedIds?.length) return;
		setSubmitting(true);
		try {
			await Promise.all(selectedIds.map((id) => axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/nhan-phong/${id}`)));
			message.success(intl.formatMessage({ id: 'kytucxa.nhanphong.checkinSuccess' }));
			setSelectedIds(undefined);
			getModel();
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
		// {
		// 	title: intl.formatMessage({ id: 'kytucxa.nhanphong.ngayNhanPhong' }),
		// 	dataIndex: 'ngayBatDau',
		// 	width: 120,
		// 	align: 'center',
		// 	sortable: true,
		// 	render: (value, record) => renderDate(record?.ngayNhanPhong || value),
		// },
		// {
		// 	title: intl.formatMessage({ id: 'kytucxa.nhanphong.ngayTraPhong' }),
		// 	dataIndex: 'ngayKetThuc',
		// 	width: 120,
		// 	align: 'center',
		// 	sortable: true,
		// 	render: (value, record) => renderDate(record?.ngayTraPhong || value),
		// },
		{
			title: intl.formatMessage({ id: 'kytucxa.nhanphong.trangThaiThanhToan' }),
			dataIndex: 'trangThaiDuyet',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: ['Unpaid', 'Underpaid', 'Paid'],
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
			buttons={{ create: false }}
			scroll={{ x: 2200 }}
			otherButtons={[
				<Popconfirm
					key='bulk-checkin'
					title={intl.formatMessage(
						{ id: 'kytucxa.nhanphong.confirmCheckinNhieu' },
						{ count: selectedIds?.length ?? 0 },
					)}
					onConfirm={handleBulkCheckin}
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
