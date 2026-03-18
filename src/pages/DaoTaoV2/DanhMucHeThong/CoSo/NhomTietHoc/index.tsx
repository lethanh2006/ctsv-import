import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectHinhThuc from '../HinhThuc/components/Select';
import SelectTrinhDo from '../TrinhDo/components/Select';
import ModalFormNhomTietHoc from './components/ModalForm';

const NhomTietHocPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, putModel, handleEdit } = useModel('daotaov2.danhmuc.nhomtiethoc');

	const onChecked = (checked: boolean, rec: NhomTietHoc.IRecordCoSo) => {
		putModel(rec?._id, { ...rec, active: checked });
	};

	const onCell = (record: NhomTietHoc.IRecordCoSo) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NhomTietHoc.IRecordCoSo>[] = [
		{
			title: 'Mã nhóm',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên nhóm tiết học',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Trình độ đào tạo',
			dataIndex: 'maTrinhDoDaoTao',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo selectMa multiple />,
			onCell,
		},
		{
			title: 'Hình thức đào tạo',
			dataIndex: 'maHinhThucDaoTao',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThuc selectMa multiple />,
			onCell,
		},
		{
			title: 'Trạng thái',
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
			render: (record: NhomTietHoc.IRecordCoSo) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa nhóm tiết học này?'
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
				modelName='daotaov2.danhmuc.nhomtiethoc'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.nhomtiethoc.title' })}
				Form={ModalFormNhomTietHoc}
				widthDrawer={800}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default NhomTietHocPage;
