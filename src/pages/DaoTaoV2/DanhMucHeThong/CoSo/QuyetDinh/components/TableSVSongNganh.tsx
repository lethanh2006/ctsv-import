import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import { ETrinhDoKqhtHocKy } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import type { SongNganh } from '@/services/DaoTaoV2/SongNganh/typing';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../../Nganh/components/SelectNganh';

const TableSVSongNganh = () => {
	const { record } = useModel('daotaov2.quyetdinh.quyetdinh');
	const { getAllModel, loading } = useModel('daotaov2.songnganh.sinhviensongnganh');
	const [DSSV, setDSSV] = useState<SongNganh.ISinhVienSongNganh[]>();

	const getData = () =>
		getAllModel(undefined, undefined, { quyetDinhId: record?._id }, undefined, undefined, false)
			.then((rec) => setDSSV(rec))
			.catch((err) => console.log(err));

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<SongNganh.ISinhVienSongNganh>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành học hiện tại',
			width: 380,
			children: [
				{
					title: 'Ngành đào đạo',
					dataIndex: 'maNganh',
					width: 180,
					render: (val, rec) => rec.nganh1?.ten ?? val,
					filterType: 'customselect',
					filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
				},
				{
					title: 'Trình độ',
					dataIndex: 'trinhDoNganh1',
					width: 120,
					filterType: 'select',
					filterData: Object.values(ETrinhDoKqhtHocKy),
				},
				{
					title: 'TBC tích lũy',
					dataIndex: 'trungBinhNganh1',
					align: 'center',
					width: 80,
					filterType: 'number',
					sortable: true,
				},
			],
		},

		{
			title: 'Ngành đăng ký',
			dataIndex: 'maNganhDangKy',
			width: 150,
			render: (val, rec) => rec.nganh2?.ten ?? val,
		},
	];

	return <TableStaticData loading={loading} data={DSSV ?? []} columns={columns} size='small' addStt hasTotal />;
};

export default TableSVSongNganh;
