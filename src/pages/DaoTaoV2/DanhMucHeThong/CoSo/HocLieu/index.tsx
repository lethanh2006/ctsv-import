import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ViewHocLieu from './components/ViewHocLieu';

const HocLieuPage = () => {
	const intl = useIntl();
	const {
		setEdit,
		setVisibleForm,
		setRecord,
		getModel,
		page,
		limit,
		deleteModel,
		record: recVanBan,
	} = useModel('daotaov2.danhmuc.hoclieu');
	const [visibleVanBan, setVisibleVanBan] = useState<boolean>(false);

	const handleEdit = (record: HocLieu.IRecord) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const onCell = (rec: HocLieu.IRecord) => ({
		onClick: () => {
			setVisibleVanBan(true);
			setRecord(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<HocLieu.IRecord>[] = [
		{
			title: 'Tên học liệu',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Mã học liệu/ISBN',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Loại học liệu',
			dataIndex: 'loaiHocLieu',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tập tin',
			dataIndex: 'url',
			width: 120,
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
			render: (record: HocLieu.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa học liệu này?'
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
				modelName='daotaov2.danhmuc.hoclieu'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.hoclieu.title' })}
				Form={Form}
				rowSelection
				deleteMany
			/>

			{recVanBan?._id ? (
				<ViewHocLieu visible={visibleVanBan} setVisible={setVisibleVanBan} hocLieuId={recVanBan._id} hasEdit />
			) : null}
		</>
	);
};

export default HocLieuPage;
