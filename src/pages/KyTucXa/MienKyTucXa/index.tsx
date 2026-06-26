import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
// import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';

const DanhSachMienKyTucXa = () => {
	const intl = useIntl();
	const t = (id: string, values?: Record<string, any>) => intl.formatMessage({ id }, values);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('kytucxa.danhsachmienkytucxa');

	const getData = () => {
		if (recHocKy?.ma) getModel({ maHocKy: recHocKy?.ma });
	};

	const renderDate = (value?: Date | string | null) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-');

	const renderStatus = (value?: string) => {
		const normalizedStatus = value?.toUpperCase();
		const color =
			normalizedStatus === 'DA_DUYET'
				? 'green'
				: normalizedStatus === 'TU_CHOI' || normalizedStatus === 'KHONG_DUYET'
					? 'red'
					: normalizedStatus === 'CHO_DUYET'
						? 'blue'
						: 'default';

		return <Tag color={color}>{value || t('kytucxa.danhsachmien.chuaNop')}</Tag>;
	};

	const columns: IColumn<DanhSachMienKTX.IRecord>[] = [
		{
			title: t('kytucxa.danhsachmien.maSinhVien'),
			dataIndex: 'maSinhVien',
			width: 130,
			filterType: 'string',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: t('kytucxa.danhsachmien.hoTen'),
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: t('kytucxa.danhsachmien.khoaSinhVien'),
			dataIndex: 'khoaSinhVien',
			width: 140,
		},
		{
			title: t('kytucxa.danhsachmien.khoa'),
			dataIndex: 'tenKhoa',
			width: 160,
			render: (value, record) => value || record.maKhoa || '-',
		},
		{
			title: t('kytucxa.danhsachmien.nganh'),
			dataIndex: 'tenNganh',
			width: 180,
			render: (value, record) => value || record.maNganh || '-',
		},
		{
			title: t('kytucxa.danhsachmien.soDienThoai'),
			dataIndex: 'soDienThoai',
			width: 130,
			filterType: 'string',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			filterType: 'string',
		},
		// {
		// 	title: t('kytucxa.danhsachmien.hanNopMinhChung'),
		// 	dataIndex: 'hanNopMinhChung',
		// 	width: 160,
		// 	align: 'center',
		// 	sortable: true,
		// 	render: (value) => renderDate(value),
		// },
		{
			title: t('kytucxa.danhsachmien.ghiChuDuyet'),
			dataIndex: 'ghiChuDuyet',
			width: 200,
		},
		{
			title: t('kytucxa.danhsachmien.minhChung'),
			dataIndex: 'urlMinhChung',
			width: 90,
			render: (val: string) => {
				if (!val) return <span style={{ color: '#bfbfbf' }}>{t('kytucxa.danhsachmien.chuaNop')}</span>;

				const filename = val.substring(val.lastIndexOf('/') + 1) || 'minh-chung.pdf';
				return (
					<a
						href={val}
						target='_blank'
						rel='noopener noreferrer'
						style={{ textDecoration: 'underline', color: '#125195', fontWeight: 500 }}
					>
						{filename}
					</a>
				);
			},
			fixed: 'right',
		},
		// {
		// 	title: t('kytucxa.danhsachmien.trangThaiMinhChung'),
		// 	dataIndex: 'trangThaiMinhChung',
		// 	width: 160,
		// 	align: 'center',
		// 	filterType: 'string',
		// 	render: renderStatus,
		// },
		// {
		// 	title: t('kytucxa.danhsachmien.ngayDuyet'),
		// 	dataIndex: 'ngayDuyet',
		// 	width: 160,
		// 	align: 'center',
		// 	sortable: true,
		// 	render: (value) => renderDate(value),
		// },
		// {
		// 	title: t('kytucxa.danhsachmien.nguoiDuyet'),
		// 	dataIndex: 'nguoiDuyet',
		// 	width: 160,
		// 	filterType: 'string',
		// },

		{
			title: t('kytucxa.danhsachmien.thaoTac'),
			key: 'action',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<ButtonExtend
						tooltip={t('global.button.chinhsua')}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, getData)}
						title={t('kytucxa.danhsachmien.confirmDeleteStudent')}
						placement='topRight'
					>
						<ButtonExtend tooltip={t('global.button.xoa')} danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
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
				modelName='kytucxa.danhsachmienkytucxa'
				title={t('kytucxa.danhsachmien.title')}
				Form={Form}
				formProps={{ getData }}
				scroll={{ x: 2200 }}
				buttons={{
					import: true,
					export: true,
				}}
				showModalTitle
			>
				<div style={{ marginBottom: 12 }}>
					<SelectNamHoc onChange={() => { }} />
				</div>
			</TableBase>
		</>
	);
};

export default DanhSachMienKyTucXa;
