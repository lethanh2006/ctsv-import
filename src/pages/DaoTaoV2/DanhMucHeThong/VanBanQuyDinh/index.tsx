import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ViewVanBanQuyDinh from './components/ViewVanBan';

const VanBanQuyDinh = () => {
	const intl = useIntl();
	const { handleEdit, setRecord, page, limit, deleteModel, record } = useModel('daotaov2.danhmuc.vanbanquydinh');
	const [visibleVanBan, setVisibleVanBan] = useState<boolean>(false);

	const onCell = (rec: VanBanQuyDinh.IRecord) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleVanBan(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<VanBanQuyDinh.IRecord>[] = [
		{
			title: 'Mã căn cứ',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên căn cứ',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Tài liệu đính kèm',
			dataIndex: 'url',
			width: 150,
			align: 'center',
			render: (val, rec) => (
				<a onClick={() => window.open(val)}>
					<EyeOutlined /> Xem tệp tin
				</a>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id)}
							title='Bạn có chắc chắn muốn xóa căn cứ pháp lý này?'
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
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotaov2.danhmuc.vanbanquydinh'
				title={intl.formatMessage({ id: 'danhmuchethong.vanbanquydinh.title' })}
				Form={Form}
				buttons={{ import: true, export: true }}
				rowSelection
				deleteMany
			/>
			{record?._id ? (
				<ViewVanBanQuyDinh
					visible={visibleVanBan}
					setVisible={setVisibleVanBan}
					condition={{ _id: record._id }}
					hasEdit
				/>
			) : null}
		</>
	);
};

export default VanBanQuyDinh;
