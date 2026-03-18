import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormHinhThucKhenThuong from './components/Form';

const HinhThucKhenThuongPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.hinhthuckhenthuong');
	const { danhSach, getAllModel } = useModel('danhmuc.loaikhenthuong');

	useEffect(() => {
		getAllModel();
	}, []);

	const columns: IColumn<HinhThucKhenThuong.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.column.ma' }),
			dataIndex: 'ma',
			// align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},

		{
			title: intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.column.ten' }),
			dataIndex: 'ten',
			width: 300,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.column.loaikhenthuong' }),
			dataIndex: 'loaiKhenThuongId',
			width: 120,
			sortable: true,
			render: (val, rec) => danhSach.find((item) => item._id === val)?.ten,
			filterType: 'select',
			filterData: danhSach.map((item) => ({ value: item._id, label: item.ten })),
		},
		// {
		// 	title: 'Hình thức khen thưởng tham khảo',
		// 	dataIndex: 'maHinhThucKhenThuongHemis',
		// 	width: 120,
		// 	render: (val, rec) => {
		// 		return rec.hinhThucKhenThuongHemis?.ten && rec.hinhThucKhenThuongHemis?.ma
		// 			? rec.hinhThucKhenThuongHemis?.ten + ` (${rec.hinhThucKhenThuongHemis?.ma})`
		// 			: rec.hinhThucKhenThuongHemis?.ten;
		// 	},
		// 	sortable: true,
		// },
		{
			title: intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.column.mota' }),
			dataIndex: 'moTa',
			width: 150,
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
			title: intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HinhThucKhenThuong.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.tooltip.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.tooltip.xoa' })}>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title={intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.tooltip.confirm.delete' })}
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
			modelName='danhmuc.hinhthuckhenthuong'
			title={intl.formatMessage({ id: 'chinhsach.hinhthuckhenthuong.title' })}
			Form={FormHinhThucKhenThuong}
			buttons={{ import: true, export: true }}
			// deleteMany
			// rowSelection
		/>
	);
};

export default HinhThucKhenThuongPage;
