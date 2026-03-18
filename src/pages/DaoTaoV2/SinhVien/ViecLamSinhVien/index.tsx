import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { EHinhThucTuyenDung, EViTriViecLam } from '@/services/DaoTaoV2/SinhVien/constant';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { tienVietNam } from '@/utils/utils';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';

const ViecLamSinhVienPage = () => {
	const intl = useIntl();
	const { getModel, page, limit } = useModel('daotaov2.sinhvien.vieclam');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<SinhVien.IViecLamSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.vieclam.column.donvitd' }),
			dataIndex: 'donViTuyenDung',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.vieclam.column.hinhthuctuyendung' }),
			width: 120,
			dataIndex: 'hinhThucTuyenDung',
			filterType: 'select',
			filterData: Object.values(EHinhThucTuyenDung),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.vieclam.column.thoigiantuyendung' }),
			width: 100,
			dataIndex: 'thoiGianTuyenDung',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.vieclam.column.vitrivieclam' }),
			width: 120,
			dataIndex: 'viTriViecLam',
			filterType: 'select',
			filterData: Object.values(EViTriViecLam),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.vieclam.column.mucluongkhoiđiem' }),
			width: 100,
			dataIndex: 'mucLuongKhoiDiem',
			filterType: 'number',
			sortable: true,
			render: (val) => val && tienVietNam(val),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				getData={() =>
					getModel(undefined, undefined, undefined, undefined, undefined, `page/sso-id/${recSinhVien?.ssoId}`)
				}
				modelName='daotaov2.sinhvien.vieclam'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default ViecLamSinhVienPage;
