import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { useModel } from 'umi';

const KhenThuongSinhVienPage = () => {
	const { getModel, page, limit } = useModel('daotaov2.sinhvien.khenthuong');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<SinhVien.IKhenThuongSinhVien>[] = [
		{
			title: 'Danh hiệu khen thưởng',
			dataIndex: 'danhHieuThiDuaGiaiThuongKhenThuong',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Cấp khen thưởng',
			width: 120,
			dataIndex: 'capKhenThuong',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Số QĐ',
			width: 90,
			dataIndex: 'soQuyetDinhKhenThuong',
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Năm KT',
			width: 90,
			dataIndex: 'namKhenThuong',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Phương thức KT',
			width: 120,
			dataIndex: 'phuongThucKhenThuong',
			filterType: 'string',
			sortable: true,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={() =>
					getModel(undefined, undefined, undefined, undefined, undefined, `page/sso-id/${recSinhVien?.ssoId}`)
				}
				dependencies={[page, limit]}
				modelName='daotaov2.sinhvien.khenthuong'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default KhenThuongSinhVienPage;
