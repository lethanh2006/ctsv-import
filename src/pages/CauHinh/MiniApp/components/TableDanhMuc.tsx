import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { MiniAppDanhMuc } from '@/services/CauHinh/MiniApp/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useModel } from 'umi';
import FormDanhMuc from './FormDanhMuc';

const TableDanhMuc = () => {
	const { getModel, page, limit, deleteModel, handleEdit, putModel, handleView } = useModel('danhmuc.miniappdanhmuc');

	const getData = () => {
		getModel();
	};

	const columns: IColumn<MiniAppDanhMuc.IRecord>[] = [
		{
			title: 'Tên danh mục',
			dataIndex: 'ten',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 100,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
			align: 'center',
			width: 120,
			render: (val: boolean, record) => (
				<Switch
					checked={val}
					checkedChildren='Kích hoạt'
					unCheckedChildren='Vô hiệu hóa'
					onChange={async (checked) => {
						try {
							await putModel(record._id, { isActive: checked }, getData);
						} catch (error) {
							console.log(error);
						}
					}}
				/>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: MiniAppDanhMuc.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button
							type='link'
							icon={<EyeOutlined />}
							onClick={() => {
								handleView(record);
							}}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(() => <FormDanhMuc getData={getData} />, []);

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.miniappdanhmuc'
			Form={Form}
			hideCard
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default TableDanhMuc;
