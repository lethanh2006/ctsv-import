import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { useModel } from 'umi';

const SinhVienChuaDangKyPage = () => {
	const { record: recordKyHoc } = useModel('daotaov2.hocky.hocky');
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');
	const { getModel, page, limit } = useModel('daotaov2.hocky.sinhvienkhongdangky');

	const getData = () =>
		getModel(
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			`page?dotDkNhuCauId=${recDotDangKy?._id}&hocKyId=${recordKyHoc?._id}`,
		);

	const onCell = (record: SinhVien.IRecord) => ({
		// onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			width: 100,
			dataIndex: 'ma',
			align: 'center',
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên sinh viên',
			width: 150,
			dataIndex: 'ten',
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			width: 100,
			render: (val, rec) => rec?.khoaNganh?.khoaSinhVien?.ten ?? '--',
			onCell,
		},
		{
			title: 'Lớp hành chính',
			width: 100,
			render: (val, rec) => rec?.lopHanhChinhList?.[0]?.ten,
			onCell,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, recDotDangKy?._id, recordKyHoc?._id]}
				modelName='daotaov2.hocky.sinhvienkhongdangky'
				hideCard
				buttons={{ create: false, export: true }}
			/>
		</>
	);
};

export default SinhVienChuaDangKyPage;
