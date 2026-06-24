import StatisticsCard from '@/components/StatisticsCard';
import type { StatisticsItem } from '@/components/StatisticsCard/typing';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ELoaiDotDangKyKTX, ETrangThaiPhatHanh } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Modal, Popconfirm, Switch, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ViewDetail from './components/ChiTietDotDangKy/ViewDetail';
import Form from './components/Form';

const getTrangThaiDot = (record: KyTucXa.IDotDangKyKTX, t: (id: string) => string) => {
	const now = dayjs();
	const thoiGianBatDau = record?.thoiGianBatDau ? dayjs(record.thoiGianBatDau) : undefined;
	const thoiGianKetThuc = record?.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc) : undefined;

	if (thoiGianKetThuc && now.isAfter(thoiGianKetThuc))
		return { label: t('kytucxa.dotdangky.status.ended'), color: 'default' };
	if (thoiGianBatDau && thoiGianKetThuc && !now.isBefore(thoiGianBatDau) && !now.isAfter(thoiGianKetThuc)) {
		return { label: t('kytucxa.dotdangky.status.ongoing'), color: 'success' };
	}

	return { label: t('kytucxa.dotdangky.status.upcoming'), color: 'processing' };
};

const DotDangKy = () => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { page, limit, handleEdit, deleteModel, getModel, setRecord, postPhatHanhKTX, putModel } =
		useModel('kytucxa.dotdangkyktx');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getThongKeDotTongQuan } = useModel('kytucxa.thongkektx');

	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<any>(null);
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);

	const fetchThongKe = (maHocKy: string) => {
		setLoadingThongKe(true);
		getThongKeDotTongQuan({ maHocKy })
			.then((res: any) => {
				setDataThongKe(res?.data?.data || res?.data || res);
			})
			.catch((err: any) => {})
			.finally(() => {
				setLoadingThongKe(false);
			});
	};

	useEffect(() => {
		if (recHocKy?.ma) {
			fetchThongKe(recHocKy.ma);
		}
	}, [recHocKy?.ma]);

	const onCell = (rec: KyTucXa.IDotDangKyKTX) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleDetail(true);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		if (recHocKy?.ma) {
			getModel({ maHocKy: recHocKy?.ma });
			fetchThongKe(recHocKy.ma);
		}
	};

	const columns: IColumn<KyTucXa.IDotDangKyKTX>[] = [
		{
			title: t('kytucxa.dotdangky.tenDot'),
			dataIndex: 'tenDot',
			width: 220,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: t('kytucxa.dotdangky.loaiDot'),
			dataIndex: 'loaiDot',
			width: 140,
			filterType: 'string',
			render: (value) =>
				value === ELoaiDotDangKyKTX.THEO_KHOA ? t('kytucxa.dotdangky.loaiDot.theoKhoa') : value || '--',
			onCell,
		},
		{
			title: t('kytucxa.dotdangky.batDau'),
			dataIndex: 'thoiGianBatDau',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
			onCell,
		},
		{
			title: t('kytucxa.dotdangky.ketThuc'),
			dataIndex: 'thoiGianKetThuc',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
			onCell,
		},
		{
			title: t('kytucxa.dotdangky.trangThai'),
			width: 130,
			align: 'center',
			render: (_value, record) => {
				const trangThai = getTrangThaiDot(record, t);
				return <Tag color={trangThai.color}>{trangThai.label}</Tag>;
			},
			onCell,
		},
		{
			title: 'Trạng thái ban hành',
			width: 120,
			align: 'center',
			render: (_value, record) => {
				const isEnded = record?.thoiGianKetThuc ? dayjs().isAfter(dayjs(record.thoiGianKetThuc)) : false;
				const isPublished = record?.trangThaiPhatHanh === ETrangThaiPhatHanh.DA_PHAT_HANH;
				return (
					<Switch
						checked={isPublished}
						disabled={isEnded || isPublished}
						onChange={async (checked) => {
							try {
								if (checked) {
									await postPhatHanhKTX(record._id);
									getData();
								}
							} catch (error) {
								console.error(error);
							}
						}}
					/>
				);
			},
		},
		{
			title: t('kytucxa.dotdangky.ghiChu'),
			dataIndex: 'ghiChu',
			width: 220,
			filterType: 'string',
			render: (value) => value || '--',
			onCell,
		},
		{
			title: t('kytucxa.dotdangky.thaoTac'),
			width: 150,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<Tooltip title={t('global.button.chitiet')}>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleDetail(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					<Tooltip title={t('global.button.chinhsua')}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={t('global.button.xoa')}>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title={t('kytucxa.dotdangky.confirmDelete')}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Tổng số đợt',
			value: dataThongKe?.tongSoDot ?? 0,
			valueColor: '#1890ff',
			status: 'info',
		},
		{
			title: 'Đã ban hành',
			value: dataThongKe?.soLuongDaPhatHanh ?? 0,
			valueColor: '#52c41a',
			status: 'success',
		},
		{
			title: 'Chưa ban hành',
			value: dataThongKe?.soLuongChuaPhatHanh ?? 0,
			valueColor: '#faad14',
			status: 'warning',
		},
		{
			title: 'Đang diễn ra',
			value: dataThongKe?.soLuongDangDienRa ?? 0,
			valueColor: '#13c2c2',
		},
		{
			title: 'Đã kết thúc',
			value: dataThongKe?.soLuongDaKetThuc ?? 0,
			valueColor: '#8c8c8c',
			status: 'gray',
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='kytucxa.dotdangkyktx'
				title={t('kytucxa.dotdangky.title')}
				Form={Form}
				formProps={{ getData }}
				buttons={{ create: !!recHocKy?.ma }}
				widthDrawer={900}
				showModalTitle
			>
				<div style={{ marginBottom: 12 }}>
					<FilterHocKy isSetHocKy width={300} hideExpand />
				</div>

				<StatisticsCard
					title=''
					hideCard
					rowGutter={16}
					colSpan={{ flex: '1 1 180px' } as any}
					borderleft={false}
					statShadow
					containerStyle={{ marginBottom: 16 }}
					data={statisticsData}
					loading={loadingThongKe}
				/>
			</TableBase>

			<Modal
				destroyOnClose
				styles={{ body: { paddingTop: 4 } }}
				width={1100}
				footer={
					<Button
						onClick={() => {
							setVisibleDetail(false);
						}}
					>
						{t('global.button.dong')}
					</Button>
				}
				title={t('kytucxa.dotdangky.chitiet') || 'Chi tiết đợt đăng ký'}
				open={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
			>
				<ViewDetail />
			</Modal>
		</>
	);
};

export default DotDangKy;
