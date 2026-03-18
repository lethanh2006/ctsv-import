import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';

const TableSVBaoLuu = () => {
	const { record } = useModel('daotaov2.quyetdinh.quyetdinh');
	const { getAllModel, loading } = useModel('daotaov2.quyetdinh.baoluu');
	const [DSSV, setDSSV] = useState<QuyetDinh.ISinhVienBaoLuuThoiHoc[]>();

	const getData = () =>
		getAllModel(undefined, undefined, { quyetDinhId: record?._id }, undefined, undefined, false)
			.then((rec) => setDSSV(rec))
			.catch((err) => console.log(err));

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<QuyetDinh.ISinhVienBaoLuuThoiHoc>[] = [
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
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			width: 120,
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			width: 120,
			sortable: true,
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 150,
			render: (val, rec) => rec.nganh?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
		},
	];
	return <TableStaticData loading={loading} data={DSSV ?? []} columns={columns} size='small' addStt hasTotal />;
};

export default TableSVBaoLuu;
