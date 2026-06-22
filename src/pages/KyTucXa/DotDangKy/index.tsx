import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
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
	const { page, limit, handleEdit, deleteModel, getModel } = useModel('kytucxa.dotdangky');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

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
		},
		{
			title: t('kytucxa.dotdangky.loaiDot'),
			dataIndex: 'loaiDot',
			width: 140,
			filterType: 'string',
			render: (value) =>
				value === ELoaiDotDangKyKTX.THEO_KHOA ? t('kytucxa.dotdangky.loaiDot.theoKhoa') : value || '--',
		},
		{
			title: t('kytucxa.dotdangky.batDau'),
			dataIndex: 'thoiGianBatDau',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
		},
		{
			title: t('kytucxa.dotdangky.ketThuc'),
			dataIndex: 'thoiGianKetThuc',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
		},
		{
			title: t('kytucxa.dotdangky.trangThai'),
			width: 130,
			align: 'center',
			render: (_value, record) => {
				const trangThai = getTrangThaiDot(record, t);
				return <Tag color={trangThai.color}>{trangThai.label}</Tag>;
			},
		},
		{
			title: t('kytucxa.dotdangky.ghiChu'),
			dataIndex: 'ghiChu',
			width: 220,
			filterType: 'string',
			render: (value) => value || '--',
		},
		{
			title: t('kytucxa.dotdangky.thaoTac'),
			width: 150,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<Tooltip title={t('global.button.chinhsua')}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					{/* <Tooltip title='Xem ID'>
						<Button
							onClick={() => {
								setSelectedId(record._id);
								setIsModalOpen(true);
							}}
							type='link'
						>
							ID
						</Button>
					</Tooltip> */}

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
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recHocKy?.ma]}
			modelName='kytucxa.dotdangky'
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
		</TableBase>
	);
};

export default DotDangKy;
