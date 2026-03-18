import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { NamHoc } from '@/services/DaoTaoV2/NamHoc/NamHoc/typings';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { history, useIntl, useModel } from 'umi';
import ModalNamHoc from './components/ModalNamHoc';

const NamHocPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.namhoc.namhoc');

	const onCell = (rec: NamHoc.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NamHoc.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Năm học',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		// {
		// 	title: 'Trình độ',
		// 	dataIndex: 'trinhDoDaoTaoId',
		// 	width: 120,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectTrinhDo multiple />,
		// 	render: (val, rec) => rec.trinhDoDaoTao?.dmTrinhDo?.ten,
		// 	onCell,
		// },
		// {
		// 	title: 'Hình thức',
		// 	dataIndex: 'hinhThucDaoTaoId',
		// 	width: 120,
		// 	filterType: 'customselect',
		// 	filterCustomSelect: <SelectHinhThuc multiple />,
		// 	render: (val, rec) => rec.hinhThucDaoTao?.danhMucHTDT?.ten,
		// 	onCell,
		// },
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Số tuần',
			dataIndex: 'soTuan',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Số kỳ chính',
			dataIndex: 'soKyChinh',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Số kỳ phụ',
			dataIndex: 'soKyPhu',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getModel)}
							title='Bạn có chắc chắn muốn xóa năm học này?'
							placement='topRight'
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
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.namhoc.namhoc'
			title={intl.formatMessage({ id: 'namhoc.namhoc.title' })}
			Form={ModalNamHoc}
			widthDrawer={1100}
			rowSelection
			deleteMany
			buttons={{ import: true, export: true, create: false }}
			otherButtons={[
				<Button type='primary' key='1' icon={<PlusCircleOutlined />} onClick={() => history.push('khoi-tao')}>
					Lập kế hoạch năm học
				</Button>,
			]}
		/>
	);
};

export default NamHocPage;
