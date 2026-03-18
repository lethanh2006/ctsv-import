import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormHinhThucKyLuat from './components/Form';
import { useEffect } from 'react';

const HinhThucKyLuatPage = () => {
	const { handleEdit, getModel, page, limit, deleteModel } = useModel('danhmuc.hinhthuckyluat');
	const { danhSach, getAllModel } = useModel('danhmuc.capkyluat');

	useEffect(() => {
		getAllModel();
	}, []);

	const columns: IColumn<HinhThucKyLuat.IRecord>[] = [
		{
			title: 'Mã nội bộ',
			dataIndex: 'ma',
			// align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên hình thức kỷ luật',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Cấp kỷ luật',
			dataIndex: 'capKyLuatId',
			width: 120,
			render: (val, rec) => danhSach.find((item) => item._id === val)?.ten,
			sortable: true,
			align: 'center',
			filterType: 'select',
			filterData: danhSach.map((item) => ({ value: item._id, label: item.ten })),
		},
		// {
		// 	title: 'Hình thức kỷ luật tham khảo',
		// 	dataIndex: 'maHinhThucKyLuatHemis',
		// 	width: 120,
		// 	render: (val, rec) => {
		// 		return rec.hinhThucKyLuatHemis?.ten && rec.hinhThucKyLuatHemis?.ma
		// 			? rec.hinhThucKyLuatHemis?.ten + ` (${rec.hinhThucKyLuatHemis?.ma})`
		// 			: rec.hinhThucKyLuatHemis?.ten;
		// 	},
		// 	sortable: true,
		// },
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 220,
			filterType: 'string',
			render: (val) => <ExpandText ellipsis={{ rows: 3 }}>{val}</ExpandText>,
			sortable: true,
		},
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
			render: (record: HinhThucKyLuat.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa hình thức kỷ luật này?'
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
			modelName='danhmuc.hinhthuckyluat'
			title='Hình thức kỷ luật'
			Form={FormHinhThucKyLuat}
			buttons={{ import: true, export: true }}
			// deleteMany
			// rowSelection
		/>
	);
};

export default HinhThucKyLuatPage;
