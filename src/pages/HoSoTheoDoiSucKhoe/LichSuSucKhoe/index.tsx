import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { colorETinhTrangSucKhoe, type ETinhTrangSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const LichSuSucKhoeSinhVienPage = () => {
	const { getAllModel, loading } = useModel('hosotheodoisuckhoe.suckhoesinhvien');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [danhSach, setDanhSach] = useState<DotKhamSucKhoe.ISucKhoeSinhVien[]>([]);

	const getData = () =>
		getAllModel(undefined, undefined, { sinhVienSsoId: recSinhVien?.ssoId }, undefined, undefined, false).then((res) =>
			setDanhSach(res),
		);

	useEffect(() => {
		getData();
	}, [recSinhVien?._id]);

	const columns: IColumn<DotKhamSucKhoe.ISucKhoeSinhVien>[] = [
		{
			title: 'Kỳ học',
			dataIndex: 'dotKhamSucKhoeId',
			width: 150,
			render: (val, rec) => rec?.dotKhamSucKhoe?.tenHocKy ?? val,
		},
		{
			title: 'Tên đợt khai báo',
			width: 170,
			dataIndex: 'dotKhamSucKhoeId',
			render: (val, rec) => rec?.dotKhamSucKhoe?.ten ?? val,
		},
		{
			title: 'Sức khỏe',
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 150,
			render: (val, rec) => <Tag color={colorETinhTrangSucKhoe[val as ETinhTrangSucKhoe]}>{val}</Tag>,
		},
	];

	return (
		<>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={danhSach}
				otherProps={{ create: false, filter: true }}
				hasTotal
				addStt
			/>
		</>
	);
};

export default LichSuSucKhoeSinhVienPage;
