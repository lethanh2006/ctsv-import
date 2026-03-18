import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiLogLopHocPhan, ELoaiThayDoiHocVien, LoaiThayDoiHocVien } from '@/services/DaoTaoV2/HocKy/constant';
import { formatPhoneNumber } from '@/utils/utils';
import { useModel } from 'umi';

/**
 * Danh sách log sinh viên đã hủy, chuyển trong lớp tín chỉ
 */
const LogLopHocPhanPage = () => {
	const { page, limit, setRecord, record } = useModel('daotaov2.hocky.loglophocphan');
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const { handleView } = useModel('daotaov2.sinhvien.sinhvien');

	const onCell = (rec: LopHocPhan.ILogLopHocPhan) => ({
		onClick: () => {
			setRecord(rec);
			handleView();
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHocPhan.ILogLopHocPhan>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maHocVien',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			width: 150,
			dataIndex: 'tenHocVien',
			filterType: 'string',
			onCell,
		},
		{
			title: 'SĐT',
			width: 120,
			render: (val, rec) => rec?.hocVien?.soDienThoai && formatPhoneNumber(rec?.hocVien?.soDienThoai),
			onCell,
		},
		{
			title: 'Email',
			width: 150,
			render: (val, rec) => rec?.hocVien?.email,
			onCell,
		},
		{
			title: 'Lớp hành chính',
			width: 120,
			onCell,
		},
		{
			title: 'Loại thay đổi sinh viên',
			dataIndex: 'loaiThayDoiHocVien',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ELoaiThayDoiHocVien).map((item) => ({ label: LoaiThayDoiHocVien[item], value: item })),
			render: (val: ELoaiThayDoiHocVien) => LoaiThayDoiHocVien?.[val],
			onCell,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, recLopHP?._id]}
				params={{ idLopGoc: recLopHP?._id, loai: ELoaiLogLopHocPhan.THAY_DOI_HOC_VIEN }}
				modelName='daotaov2.hocky.loglophocphan'
				buttons={{ create: false, export: true }}
				hideCard
			/>

			<ModalChiTietSinhVien sinhVienSsoId={record?.hocVienSsoId ?? ''} />
		</>
	);
};

export default LogLopHocPhanPage;
