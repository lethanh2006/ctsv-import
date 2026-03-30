import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const LoaiHocBongPage = () => {
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel('danhmuc.loaihocbong');

	const handleEdit = (record: LoaiHocBong.IRecord) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<LoaiHocBong.IRecord>[] = [
		{
			title: 'Loại học bổng',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
			resizable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LoaiHocBong.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa loại học bổng này?'
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
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.loaihocbong'
			title='Loại học bổng'
			Form={Form}
		/>
	);
};

export default LoaiHocBongPage;
