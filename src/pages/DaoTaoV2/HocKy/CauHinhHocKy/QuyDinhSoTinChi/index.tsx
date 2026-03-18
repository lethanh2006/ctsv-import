import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { ELoaiHocLuc, colorLoaiHocLuc } from '@/services/DaoTaoV2/HocKy/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const QuyDinhSoTinChiPage = () => {
	const intl = useIntl();
	const { record: recordHocKy, setVisibleForm } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, deleteModel, handleEdit, danhSach } = useModel('daotaov2.hocky.quydinhsotinchi');

	const columns: IColumn<HocKy.IQuyDinhSoTinChiDangKy>[] = [
		{
			title: 'Học lực',
			dataIndex: 'loaiHocLuc',
			align: 'center',
			width: 120,
			render: (val) => <Tag color={colorLoaiHocLuc[val as ELoaiHocLuc]}>{val}</Tag>,
		},
		{
			title: 'Số TC tối thiểu',
			dataIndex: 'soTinChiToiThieu',
			align: 'center',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Số TC tối đa',
			dataIndex: 'soTinChiToiDa',
			align: 'center',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Số TC tối đa song ngành',
			dataIndex: 'soTinChiToiDaSongNganh',
			align: 'center',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HocKy.IQuyDinhSoTinChiDangKy) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ maHocKy: recordHocKy?.ma }))}
							title='Bạn có chắc chắn muốn xóa quy định này này?'
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
				params={{ maHocKy: recordHocKy?.ma }}
				dependencies={[page, limit, recordHocKy?.ma]}
				modelName='daotaov2.hocky.quydinhsotinchi'
				title={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.quydinhsotinchi.title' })}
				Form={Form}
				hideCard
				rowSelection
				deleteMany
				buttons={{ create: danhSach.length < Object.values(ELoaiHocLuc).length }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</>
	);
};

export default QuyDinhSoTinChiPage;
