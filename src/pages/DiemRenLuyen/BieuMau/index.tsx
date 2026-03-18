import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/KhaoSat/BieuMau/typing';
import { ELoaiBieuMau } from '@/services/KhaoSat/constant';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import ViewDetailDanhGiaCanBo from './components/FormViewDetailDanhGiaCanBo';
import ViewDetailDiemRenLuyen from './components/FormViewDetailDiemRenLuyen';
import FormViewDetailKhaoSat from './components/FormViewDetailKhaoSat';
import Form from './components/Modal';

const KhaoSatPage = () => {
	const intl = useIntl();
	const {
		page,
		limit,
		deleteModel,
		handleEdit,
		handleView,
		isView,
		kichHoatBieuMauModel,
		record: recordBieuMau,
		getModel,
	} = useModel('khaosat.bieumau');

	const getData = () => {
		getModel({ loai: ELoaiBieuMau.CHAM_DIEM_REN_LUYEN });
	};

	const handleChangeStatus = (rec: BieuMau.IRecord) =>
		kichHoatBieuMauModel({ id: rec._id, data: { kichHoat: !rec.kichHoat } }, getData);

	const onCell = (record: BieuMau.IRecord) => ({
		onClick: () => handleView(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BieuMau.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'bieumau.column.tieude' }),
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'bieumau.column.mota' }),
			dataIndex: 'moTa',
			width: 250,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		// {
		// 	title: 'Loại biểu mẫu',
		// 	dataIndex: 'loai',
		// 	width: 120,
		// 	filterType: 'select',
		// 	filterData: Object.values(ELoaiBieuMau),
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'bieumau.column.trangthai' }),
			dataIndex: 'kichHoat',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, record) => (
				<Switch checked={record.kichHoat} onChange={() => handleChangeStatus(record)} size='small' />
			),
		},
		{
			title: intl.formatMessage({ id: 'bieumau.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: BieuMau.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'bieumau.action.preview' })}>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							// disabled={!canDelete}
							onConfirm={() => deleteModel(record._id, getData)}
							title={intl.formatMessage({ id: 'bieumau.confirm.delete' })}
							placement='topRight'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='khaosat.bieumau'
			title={intl.formatMessage({ id: 'bieumau.title' })}
			widthDrawer={800}
			getData={getData}
			formProps={{ getData: getData }}
			Form={
				(isView
					? recordBieuMau?.loai === ELoaiBieuMau.KHAO_SAT
						? FormViewDetailKhaoSat
						: recordBieuMau?.loai === ELoaiBieuMau.DANH_GIA_CAN_BO
							? ViewDetailDanhGiaCanBo
							: ViewDetailDiemRenLuyen
					: Form) as any
			}
		/>
	);
};

export default KhaoSatPage;
