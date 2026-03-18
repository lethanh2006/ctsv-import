import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import ModalNhuCauSinhVien from './ModalNhuCauSinhVien';

const PhieuDangKyNhuCauPage = () => {
	const { record: recordKyHoc } = useModel('daotaov2.hocky.hocky');
	const { record: recDotDangKy, danhSach: danhSachDot } = useModel('daotaov2.hocky.dotdangkynhucau');
	const { setRecord, setVisibleForm, setEdit, deleteModel, getModel, page, limit } =
		useModel('daotaov2.hocky.dangkynhucau');

	const getData = () => {
		if (danhSachDot.length)
			getModel(undefined, [
				{
					active: true,
					field: 'dotDkNhuCauId',
					operator: EOperatorType.INCLUDE,
					values: recDotDangKy?._id ? [recDotDangKy?._id] : danhSachDot.map((item) => item._id),
				},
			]);
	};

	const handleEdit = (record: DangKyNhuCau.IDangKyNhuCau) => {
		setRecord(record);
		setVisibleForm(true);
		setEdit(true);
	};

	const onCell = (record: DangKyNhuCau.IDangKyNhuCau) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DangKyNhuCau.IDangKyNhuCau>[] = [
		{
			title: 'Đợt đăng ký',
			width: 120,
			render: (val, rec) => rec.dotDkNhuCau?.ten,
			onCell,
			hide: !!recDotDangKy?._id,
		},
		{
			title: 'Mã sinh viên',
			width: 100,
			align: 'center',
			render: (val, rec) => rec.sinhVien?.ma,
			onCell,
		},
		{
			title: 'Họ tên sinh viên',
			width: 150,
			dataIndex: 'sinhVienSsoId',
			filterType: 'customselect',
			filterCustomSelect: <SelectSinhVienDebounce multiple />,
			render: (val, rec) => rec.sinhVien?.ten,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			width: 100,
			render: (val, rec) => rec.sinhVien?.khoaNganh?.khoaSinhVien?.ten ?? '--',
			onCell,
		},
		{
			title: 'Lớp hành chính',
			width: 100,
			render: (val, rec) => rec.sinhVien?.lopHanhChinhList?.[0]?.ten,
			onCell,
		},
		{
			title: 'Tổng số tín chỉ đăng ký',
			width: 100,
			dataIndex: 'tongSoNhuCau',
			filterType: 'number',
			sortable: true,
			align: 'center',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DangKyNhuCau.IDangKyNhuCau) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa phiếu đăng ký nhu cầu này?'
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
				getData={getData}
				dependencies={[page, limit, recDotDangKy?._id, recordKyHoc?.ma]}
				modelName='daotaov2.hocky.dangkynhucau'
				title='Phiếu đăng ký nhu cầu'
				Form={ModalNhuCauSinhVien}
				formProps={{ getData }}
				widthDrawer={800}
				hideCard
				buttons={{ import: true, export: true, create: !!recDotDangKy?._id }}
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default PhieuDangKyNhuCauPage;
