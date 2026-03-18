import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type CongNhanKQHT } from '@/services/DaoTaoV2/KetQuaHocTap/CongNhan/typing';
import { ELoaiDiemChu, ETrangThaiCongNhanKqht } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const PageCongNhanKetQua = () => {
	const intl = useIntl();
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
		'daotaov2.ketquahoctap.congnhan',
	);

	const handleEdit = (record: CongNhanKQHT.IRecord) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<CongNhanKQHT.IRecord>[] = [
		{
			title: 'Sinh viên',
			dataIndex: 'sinhVienSsoId',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectSinhVienDebounce />,
			render: (val, rec) => [rec.sinhVien?.ten, rec.sinhVien?.ma].join(' - '),
		},
		{
			title: 'Học phần',
			dataIndex: 'hocPhanId',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectHocPhan multiple />,
			render: (val, rec) => [rec.hocPhan?.ten, rec.hocPhan?.ma].join(' - '),
		},
		{
			title: 'Điểm tổng kết quy đổi',
			dataIndex: 'diemTongKetQuyDoi',
			width: 120,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Điểm thang 4 quy đổi',
			dataIndex: 'diemThang4QuyDoi',
			width: 120,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Điểm chữ quy đổi',
			dataIndex: 'diemChuQuyDoi',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrangThaiCongNhanKqht),
		},
		{
			title: 'Minh chứng',
			dataIndex: 'minhChungId',
			align: 'center',
			width: 150,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: CongNhanKQHT.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa cơ sở đào tạo này?'
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
			modelName='daotaov2.ketquahoctap.congnhan'
			title={intl.formatMessage({ id: 'ketquahoctap.congnhanketqua.title' })}
			Form={Form}
			rowSelection
			deleteMany
		/>
	);
};

export default PageCongNhanKetQua;
