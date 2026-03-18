import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const DauDiemHocPhanPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, putModel, handleEdit } = useModel('daotaov2.danhmuc.daudiemhocphan');

	const columns: IColumn<DauDiemHocPhan.IRecord>[] = [
		{
			title: 'Tên đầu điểm',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Trường dữ liệu',
			dataIndex: 'field',
			width: 150,
			render: (val) => `Trọng số ${val}`,
		},
		// {
		//   title: 'Thứ tự sắp xếp',
		//   dataIndex: 'order',
		//   align: 'center',
		//   width: 80,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DauDiemHocPhan.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đầu điểm này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	// const onSortEnd = (record: DauDiemHocPhan.IRecord, newIndex: number) => {
	//   putModel(record._id, { ...record, order: (page - 1) * limit + newIndex });
	// };

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotaov2.danhmuc.daudiemhocphan'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.dauiemhocphan.title' })}
				Form={Form}
				rowSelection
				deleteMany
				// rowSortable
				// onSortEnd={onSortEnd}
			/>
		</>
	);
};

export default DauDiemHocPhanPage;
