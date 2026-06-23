import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Card, Modal, Popconfirm, Statistic, Tag, Tooltip } from 'antd';
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
	const { page, limit, handleEdit, deleteModel, getModel, record, setRecord } = useModel('kytucxa.dotdangkyktx');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getThongKeDotTongQuan } = useModel('kytucxa.thongkektx');

	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<any>(null);

	const fetchThongKe = (maHocKy: string) => {
		getThongKeDotTongQuan({ maHocKy })
			.then((res: any) => {
				setDataThongKe(res?.data?.data || res?.data || res);
			})
			.catch((err: any) => {
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

				<div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
					<Card
						style={{ flex: 1, minWidth: 160, borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', border: '1px solid #f0f0f0' }}
						styles={{ body: { padding: '12px 16px' } }}
					>
						<Statistic
							title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Tổng số đợt</span>}
							value={dataThongKe?.tongSoDot ?? 0}
							valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
						/>
					</Card>
					<Card
						style={{ flex: 1, minWidth: 160, borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', border: '1px solid #f0f0f0' }}
						styles={{ body: { padding: '12px 16px' } }}
					>
						<Statistic
							title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Đã ban hành</span>}
							value={dataThongKe?.soLuongDaPhatHanh ?? 0}
							valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
						/>
					</Card>
					<Card
						style={{ flex: 1, minWidth: 160, borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', border: '1px solid #f0f0f0' }}
						styles={{ body: { padding: '12px 16px' } }}
					>
						<Statistic
							title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Chưa ban hành</span>}
							value={dataThongKe?.soLuongChuaPhatHanh ?? 0}
							valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
						/>
					</Card>
					<Card
						style={{ flex: 1, minWidth: 160, borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', border: '1px solid #f0f0f0' }}
						styles={{ body: { padding: '12px 16px' } }}
					>
						<Statistic
							title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Đang diễn ra</span>}
							value={dataThongKe?.soLuongDangDienRa ?? 0}
							valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
						/>
					</Card>
					<Card
						style={{ flex: 1, minWidth: 160, borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)', border: '1px solid #f0f0f0' }}
						styles={{ body: { padding: '12px 16px' } }}
					>
						<Statistic
							title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Đã kết thúc</span>}
							value={dataThongKe?.soLuongDaKetThuc ?? 0}
							valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
						/>
					</Card>
				</div>
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
				title={
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '97%', paddingRight: 8 }}>
						<span>{t('kytucxa.dotdangky.chitiet') || 'Chi tiết đợt đăng ký'}</span>
						<Button
							icon={<ArrowLeftOutlined />}
							onClick={() => setVisibleDetail(false)}
							size='small'
						>
							{t('kytucxa.dotdangky.quayLai') || 'Quay lại'}
						</Button>
					</div>
				}
				open={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
			>
				<ViewDetail />
			</Modal>
		</>
	);
};

export default DotDangKy;
