import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DotXetTotNghiep } from '@/services/DaoTaoV2/TotNghiep/DotXetTotNghiep/typing';
import {
	ETrangThaiTotNghiep,
	colorTrangThaiTotNghiep,
	colorXepHangSinhVien,
	type EXepHangSinhVien,
} from '@/services/DaoTaoV2/TotNghiep/constant';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TableSVTotNghiep = () => {
	const { record } = useModel('daotaov2.quyetdinh.quyetdinh');
	const { getAllModel, loading } = useModel('daotaov2.totnghiep.sinhviendot');
	const [DSSV, setDSSV] = useState<DotXetTotNghiep.ISinhVienDot[]>();

	const getData = () =>
		getAllModel(undefined, undefined, { quyetDinhId: record?._id }, undefined, undefined, false)
			.then((rec) => setDSSV(rec))
			.catch((err) => console.log(err));

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<DotXetTotNghiep.ISinhVienDot>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 100,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => val ?? rec.sinhVien?.ma,
		},
		{
			title: 'Họ tên',
			dataIndex: 'tenSinhVien',
			width: 180,
			filterType: 'string',
			render: (val, rec) => val ?? rec.sinhVien?.ten,
		},
		{
			title: 'Khóa',
			width: 100,
			render: (val, rec) => rec.sinhVien?.maKhoaSinhVien,
		},
		{
			title: 'Ngành',
			width: 150,
			render: (val, rec) => rec.sinhVien?.maNganh,
		},

		{
			title: 'Xếp hạng',
			dataIndex: 'xepHang',
			align: 'center',
			width: 120,
			render: (val: EXepHangSinhVien) =>
				val ? <Tag color={colorXepHangSinhVien[val]}>{val}</Tag> : <i>Chưa xếp hạng</i>,
		},

		{
			title: 'Trạng thái tốt nghiệp',
			dataIndex: 'trangThaiTotNghiepSinhVien',
			align: 'center',
			width: 150,
			render: (val: ETrangThaiTotNghiep) => (
				<Tag color={colorTrangThaiTotNghiep[val ?? ETrangThaiTotNghiep.CHO_XET]}>
					{val ?? ETrangThaiTotNghiep.CHO_XET}
				</Tag>
			),
		},
	];

	return <TableStaticData loading={loading} data={DSSV ?? []} columns={columns} size='small' addStt hasTotal />;
};

export default TableSVTotNghiep;
