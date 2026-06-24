import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { MiniApp } from '@/services/CauHinh/MiniApp/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useModel } from 'umi';
import FormMiniApp from './FormMiniApp';

const TableMiniApp = () => {
	const { getModel, page, limit, deleteModel, handleEdit, putModel, handleView } = useModel('danhmuc.miniapp');

	const getData = () => {
		getModel();
	};

	const columns: IColumn<MiniApp.IRecord>[] = [
		{
			title: 'Tên miniapp',
			dataIndex: 'ten',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Đường dẫn',
			dataIndex: 'urlMiniApp',
			width: 150,
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
			render: (record: MiniApp.IRecord) => (
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

	const Form = useCallback(() => <FormMiniApp getData={getData} />, []);

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.miniapp'
			Form={Form}
			hideCard
			widthDrawer={700}
			otherProps={{
				size: 'small',
			}}
		/>
	);
};

export default TableMiniApp;
