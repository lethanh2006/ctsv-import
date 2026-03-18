import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { useModel } from 'umi';

const TableSVQuyDoi = () => {
	const { danhSach, selectedIds } = useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');

	const columns: IColumn<DotQuyDoiDiem.IQuyDoiDiemSinhVien>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Học phần được quy đổi',
			width: 250,
			children: [
				{
					title: 'Tên học phần',
					dataIndex: 'maHocPhan',
					width: 150,
					render: (val, rec) => rec.hocPhan?.ten,
				},
				{
					title: 'Số tín chỉ',
					dataIndex: 'maHocPhan',
					align: 'center',
					width: 100,
					render: (val, rec) => rec.hocPhan?.soTinChi,
				},
			],
		},
		{
			title: 'Kết quả quy đổi',
			width: 250,
			children: [
				{
					title: 'Điểm thang 10',
					dataIndex: 'diemHe10',
					width: 100,
				},
				{
					title: 'Điểm thang 4',
					dataIndex: 'diemHe4',
					width: 100,
				},
				{
					title: 'Điểm chữ',
					dataIndex: 'diemChu',
					width: 100,
				},
			],
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginBottom: 8 }}>
				Danh sách sinh viên
			</div>
			<TableStaticData
				data={danhSach.filter((item) => selectedIds?.includes(item._id))}
				columns={columns}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			/>
		</>
	);
};

export default TableSVQuyDoi;
