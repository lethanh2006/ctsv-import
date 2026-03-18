import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormCapKyLuat from './components/Form';

const CapKyLuatPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.capkyluat');

	const columns: IColumn<CapKyLuat.IRecord>[] = [
		{
			title: 'Mã nội bộ',
			dataIndex: 'ma',
			// align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên cấp kỷ luật',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
			sortable: true,
		},
		// {
		// 	title: 'Cấp kỷ luật tham khảo',
		// 	dataIndex: 'maCapKyLuatHemis',
		// 	width: 170,
		// 	render: (val, rec) => {
		// 		return rec.capKyLuatHemis?.ten && rec.capKyLuatHemis?.ma
		// 			? rec.capKyLuatHemis?.ten + ` (${rec.capKyLuatHemis?.ma})`
		// 			: rec.capKyLuatHemis?.ten;
		// 	},
		// 	sortable: true,
		// },
		// {
		//   title: 'Sử dụng',
		//   dataIndex: 'suDung',
		//   align: 'center',
		//   width: 120,
		//   render: (val, rec) => (
		//     <Switch
		//       checked={val}
		//       onChange={(checked: boolean) => {
		//         putModel(rec._id, { ...rec, suDung: checked });
		//       }}
		//     />
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: CapKyLuat.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa cấp kỷ luật này?'
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
			modelName='danhmuc.capkyluat'
			title='Cấp kỷ luật'
			Form={FormCapKyLuat}
			buttons={{ import: true, export: true }}
			// deleteMany
			// rowSelection
		/>
	);
};

export default CapKyLuatPage;
