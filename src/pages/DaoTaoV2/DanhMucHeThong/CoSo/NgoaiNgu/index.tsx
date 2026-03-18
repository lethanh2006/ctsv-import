import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const NgoaiNguPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.ngoaingu');

	const columns: IColumn<NgoaiNgu.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngoại ngữ',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: NgoaiNgu.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa ngôn ngữ này?'
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
				modelName='daotaov2.danhmuc.ngoaingu'
				title={intl.formatMessage({ id: 'danhmuchethong.ngoaingu.title' })}
				Form={Form}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default NgoaiNguPage;
