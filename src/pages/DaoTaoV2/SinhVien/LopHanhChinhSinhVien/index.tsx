import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { useIntl, useModel } from 'umi';

const LopHanhChinhSinhVien = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.lophanhchinh.tenlop' }),
			width: 120,
			render: (_, rec) => rec.lopHanhChinh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.lophanhchinh.siso' }),
			align: 'center',
			width: 80,
			render: (_, rec) => rec.lopHanhChinh?.siSo,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.lophanhchinh.covanhoctap' }),
			width: 180,
			render: (_, rec) =>
				`${rec.lopHanhChinh?.nhanSu?.hoDem ?? ''} ${rec.lopHanhChinh?.nhanSu?.ten ?? ''} - ${
					rec.lopHanhChinh?.nhanSu?.maCanBo ?? ''
				}`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.lophanhchinh.nganhdaotao' }),
			width: 140,
			render: (_, rec) => rec.lopHanhChinh?.nganh?.ten,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ sinhVienSsoId: recSinhVien?.ssoId }}
				dependencies={[page, limit, recSinhVien?.ssoId]}
				modelName='daotaov2.namhoc.sinhvienlophanhchinh'
				buttons={{ create: false, reload: false }}
				hideTotal
				hideCard
			/>
		</>
	);
};

export default LopHanhChinhSinhVien;
