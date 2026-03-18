import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const LoaiHoatDongTuan = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, putModel, handleEdit } = useModel('daotaov2.danhmuc.loaihoatdongtuan');

	const onChecked = (checked: boolean, rec: LoaiHoatDongTuan.IRecord) =>
		putModel(rec?._id, { ...rec, active: checked });

	const onCell = (record: LoaiHoatDongTuan.IRecord) => ({
		style: { background: record.maMau },
	});

	const columns: IColumn<LoaiHoatDongTuan.IRecord>[] = [
		{
			title: 'Tên loại hoạt động tuần',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
			// onCell,
		},
		{
			title: 'Ký hiệu',
			dataIndex: 'kyHieu',
			width: 80,
			filterType: 'string',
			sortable: true,
			align: 'center',
			onCell,
		},
		{
			title: 'Trạng thái hoạt động',
			dataIndex: 'active',
			align: 'center',
			width: 80,
			render: (val, rec) => <Switch checked={val} onChange={(checked) => onChecked(checked, rec)} size='small' />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LoaiHoatDongTuan.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa loại hoạt động tuần này?'
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
			modelName='daotaov2.danhmuc.loaihoatdongtuan'
			title={intl.formatMessage({ id: 'danhmuchethong.coso.loaihoatdongtuan.title' })}
			Form={Form}
			rowSelection
			deleteMany
			buttons={{ import: true, export: true }}
		/>
	);
};

export default LoaiHoatDongTuan;
