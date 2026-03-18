import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import type { SinhVienHpHk } from '@/services/DaoTaoV2/HocKy/SinhVienHocPhan/typing';
import { ELoaiHpSv, ELoaiNhuCauHocPhan, ETrangThaiThi, loaiNhuCauHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Descriptions } from 'antd';
import { useModel } from 'umi';

/**
 * Danh sách sinh viên - học phần trong học kỳ
 */
const SinhVienHpHkPage = (props: { maKhoaNganh?: string; maHocPhan?: string; loaiNhuCau?: ELoaiNhuCauHocPhan }) => {
	const { maKhoaNganh, maHocPhan, loaiNhuCau } = props;
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { page, limit, setRecord, record } = useModel('daotaov2.hocky.sinhvienhphk');
	const { handleView } = useModel('daotaov2.sinhvien.sinhvien');

	const onCell = (rec: SinhVienHpHk.IRecord) => ({
		onClick: () => {
			setRecord(rec);
			handleView();
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVienHpHk.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			width: 180,
			dataIndex: 'hoTenSinhVien',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Lớp hành chính',
			width: 120,
			render: (val, rec) => rec.sinhVien?.lopHanhChinhList?.at(-1)?.ten,
			onCell,
		},
	];

	return (
		<>
			<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
				<Descriptions.Item label='Học kỳ'>{recHocKy?.ten}</Descriptions.Item>
				<Descriptions.Item label='Mã học phần'>{maHocPhan}</Descriptions.Item>
				<Descriptions.Item label='Mã khóa ngành'>{maKhoaNganh}</Descriptions.Item>
				<Descriptions.Item label='Loại nhu cầu'>{loaiNhuCau ? loaiNhuCauHocPhan[loaiNhuCau] : ''}</Descriptions.Item>
			</Descriptions>

			<TableBase
				columns={columns}
				dependencies={[page, limit, recHocKy?.ma, maKhoaNganh, maHocPhan, loaiNhuCau]}
				params={{
					maHocKy: recHocKy?.ma,
					maKhoaNganh,
					maHocPhan,
					loai:
						loaiNhuCau === ELoaiNhuCauHocPhan.CAM_THI || loaiNhuCau === ELoaiNhuCauHocPhan.HOC_LAI
							? ELoaiHpSv.HOC_LAI
							: loaiNhuCau === ELoaiNhuCauHocPhan.HOC_CAI_THIEN
							? ELoaiHpSv.HOC_CAI_THIEN
							: ELoaiHpSv.THEO_KE_HOACH,
					trangThaiThi:
						loaiNhuCau === ELoaiNhuCauHocPhan.CAM_THI
							? ETrangThaiThi.CAM_THI
							: loaiNhuCau === ELoaiNhuCauHocPhan.HOC_LAI
							? ETrangThaiThi.DU_DIEU_KIEN
							: undefined,
				}}
				modelName='daotaov2.hocky.sinhvienhphk'
				buttons={{ create: false, export: true }}
				hideCard
				otherProps={{ size: 'small' }}
			/>

			<ModalChiTietSinhVien sinhVienSsoId={record?.sinhVienSsoId ?? ''} />
		</>
	);
};

export default SinhVienHpHkPage;
