import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import { type QuyDoiDiem } from '@/services/DaoTaoV2/DanhMucHeThong/QuyDoiDiem/typing';

const QuyDoiDiemPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.quydoidiem');

	const columns: IColumn<QuyDoiDiem.IRecord>[] = [
		{
			title: 'Điểm cận dưới',
			dataIndex: 'diemFrom',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Điểm cận trên',
			dataIndex: 'diemTo',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Điểm thang 4 quy đổi',
			dataIndex: 'diemThang4',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Điểm chữ quy đổi',
			dataIndex: 'diemChu',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: QuyDoiDiem.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa mục này?'
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
			modelName='daotaov2.danhmuc.quydoidiem'
			title={intl.formatMessage({ id: 'danhmuchethong.coso.quydoidiem.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
			rowSelection
			deleteMany
		/>
	);
};

export default QuyDoiDiemPage;
