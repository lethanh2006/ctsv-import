import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ENoiNgoaiTru } from '@/services/DaoTaoV2/SinhVien/constant';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';

const NoiNgoaiTruSinhVienPage = () => {
	const intl = useIntl();
	const { getModel, page, limit } = useModel('daotaov2.sinhvien.noingoaitru');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<SinhVien.INoiTruSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.ntnt.column.kyhoc' }),
			dataIndex: 'maKyHoc',
			width: 90,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.ntnt.column.trangthai' }),
			width: 90,
			dataIndex: 'tinhTrang',
			filterType: 'select',
			filterData: Object.values(ENoiNgoaiTru),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.ntnt.column.thoigian' }),
			width: 100,
			dataIndex: 'thoiGianKhaiBao',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.ntnt.column.diachi' }),
			width: 200,
			dataIndex: 'diaChi',
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
				modelName='daotaov2.sinhvien.noingoaitru'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default NoiNgoaiTruSinhVienPage;
