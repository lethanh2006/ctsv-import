import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const ToaNhaPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.toanha');

	const columns: IColumn<ToaNha.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên tòa nhà',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Số tầng',
			dataIndex: 'soTang',
			width: 100,
			align: 'center',
			sortable: true,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			filterType: 'string',
			width: 180,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id)}
							title='Bạn có chắc chắn muốn xóa tòa nhà này?'
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
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotaov2.danhmuc.toanha'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.toanha.title' })}
				Form={Form}
				rowSelection
				deleteMany
				widthDrawer={800}
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default ToaNhaPage;
