import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormLoaiKhenThuong from './components/Form';

const LoaiKhenThuongPage = () => {
	const { handleEdit, getModel, page, limit, deleteModel } = useModel('danhmuc.loaikhenthuong');

	const columns: IColumn<LoaiKhenThuong.IRecord>[] = [
		{
			title: 'Mã nội bộ',
			dataIndex: 'ma',
			// align: 'center',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên loại khen thưởng',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 220,
			filterType: 'string',
			render: (val) => <ExpandText ellipsis={{ rows: 3 }}>{val}</ExpandText>,
			sortable: true,
		},
		// {
		// 	title: 'Loại khen thưởng tham khảo',
		// 	dataIndex: 'maLoaiKhenThuongHemis',
		// 	width: 120,
		// 	render: (val, rec) => {
		// 		return rec.loaiKhenThuongHemis?.ten && rec.loaiKhenThuongHemis?.ma
		// 			? rec.loaiKhenThuongHemis?.ten + ` (${rec.loaiKhenThuongHemis?.ma})`
		// 			: rec.loaiKhenThuongHemis?.ten;
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
			render: (record: LoaiKhenThuong.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa loại khen thưởng này?'
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
			modelName='danhmuc.loaikhenthuong'
			title='Loại khen thưởng'
			buttons={{ import: true, export: true }}
			Form={FormLoaiKhenThuong}
			// deleteMany
			// rowSelection
		/>
	);
};

export default LoaiKhenThuongPage;
