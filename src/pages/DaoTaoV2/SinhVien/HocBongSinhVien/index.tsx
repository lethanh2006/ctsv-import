import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectLoaiHocBong from '@/pages/DaoTaoV2/DanhMucHeThong/LoaiHocBong/components/Select';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { tienVietNam } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const HocBongSinhVienPage = () => {
	const intl = useIntl();
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
		useModel('daotaov2.sinhvien.hocbong');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const handleEdit = (record: SinhVien.IHocBongSinhVien) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<SinhVien.IHocBongSinhVien>[] = [
		{
			title: 'Tên học bổng',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Đơn vị tài trợ',
			width: 150,
			dataIndex: 'donViTaiTro',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Thời gian trao',
			width: 120,
			dataIndex: 'thoiGianTraoTangHocBong',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Loại học bổng',
			width: 120,
			dataIndex: 'loaiHocBongId',
			filterType: 'customselect',
			filterCustomSelect: <SelectLoaiHocBong multiple hasCreate={false} />,
			render: (val, rec) => rec.loaiHocBong?.ten,
		},
		{
			title: 'Giá trị học bổng',
			width: 120,
			dataIndex: 'giaTriHocBong',
			filterType: 'number',
			sortable: true,
			render: (val) => val && tienVietNam(val),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IHocBongSinhVien) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ sinhVienSsoId: recSinhVien?.ssoId }))}
							title='Bạn có chắc chắn muốn xóa học bổng này?'
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
				params={{ sinhVienSsoId: recSinhVien?.ssoId }}
				modelName='daotaov2.sinhvien.hocbong'
				title={intl.formatMessage({ id: 'sinhvien.hocbongsinhvien.title' })}
				Form={Form}
				hideCard
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default HocBongSinhVienPage;
