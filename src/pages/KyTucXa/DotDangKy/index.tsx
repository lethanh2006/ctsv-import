import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
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

	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);

	const onCell = (rec: KyTucXa.IDotDangKyKTX) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleDetail(true);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		if (recHocKy?.ma) getModel({ maHocKy: recHocKy?.ma });
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
					<FilterHocKy isSetHocKy width={300} />
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
				title={record?.tenDot}
				open={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
			>
				<ViewDetail />
			</Modal>
		</>
	);
};

export default DotDangKy;
