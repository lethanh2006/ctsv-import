import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { PhongHoc } from '@/services/DaoTaoV2/DanhMucHeThong/PhongHoc/typing';
import { ELoaiPhongHoc, ETrangThaiPhong } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectToaNha from '../ToaNha/components/Select';
import Form from './components/Form';

const PhongHocPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.phonghoc');

	const columns: IColumn<PhongHoc.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên phòng',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Loại phòng',
			dataIndex: 'loaiPhong',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ELoaiPhongHoc),
		},
		{
			title: 'Tòa nhà',
			dataIndex: 'maToaNha',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectToaNha selectMa multiple />,
			render: (val, rec) => rec.toaNha?.ten ?? val,
		},
		{
			title: 'Tầng thứ',
			dataIndex: 'soTang',
			width: 80,
			align: 'center',
			sortable: true,
			filterType: 'number',
		},
		{
			title: 'Số phòng',
			dataIndex: 'soPhong',
			width: 100,
			align: 'center',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhong),
			render: (val: ETrangThaiPhong) =>
				val && <Tag color={val === ETrangThaiPhong.BAO_TRI ? 'orange' : 'green'}>{val}</Tag>,
		},
		{
			title: 'Sức chứa',
			width: 160,
			children: [
				{
					title: 'Phòng họp',
					dataIndex: 'sucChua',
					width: 80,
					align: 'center',
					filterType: 'number',
					sortable: true,
				},
				{
					title: 'Học',
					dataIndex: 'sucChuaHoc',
					width: 80,
					align: 'center',
					filterType: 'number',
					sortable: true,
				},
				{
					title: 'Thi',
					dataIndex: 'sucChuaThi',
					width: 80,
					align: 'center',
					filterType: 'number',
					sortable: true,
				},
			],
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: PhongHoc.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa phòng học này?'
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
			modelName='daotaov2.danhmuc.phonghoc'
			title={intl.formatMessage({ id: 'danhmuchethong.coso.phonghoc.title' })}
			Form={Form}
			widthDrawer={800}
			rowSelection
			deleteMany
			buttons={{ import: true, export: true }}
		/>
	);
};

export default PhongHocPage;
