import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';

const LoaiChungChiPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.loaichungchi');

	const columns: IColumn<ChungChi.ILoaiChungChi>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên loại chứng chỉ',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngoại ngữ',
			dataIndex: 'isNgoaiNgu',
			align: 'center',
			width: 140,
			render: (val, rec) =>
				val ? <Tag color='green'>Chứng chỉ ngoại ngữ</Tag> : <Tag color='yellow'>Chứng chỉ thường</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: ChungChi.ILoaiChungChi) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa loại chứng chỉ này?'
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
				modelName='daotaov2.danhmuc.loaichungchi'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.loaichungchi.title' })}
				Form={Form}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default LoaiChungChiPage;
