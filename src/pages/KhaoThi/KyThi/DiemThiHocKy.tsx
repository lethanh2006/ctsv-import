import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DiemThiHocKy = (props: { sinhVienSsoId: string; maHocKy: string; maHocPhan: string }) => {
	const { sinhVienSsoId, maHocKy, maHocPhan } = props;
	const { diemThiHocKySinhVien, loading, getDiemThiHocKySinhVienModel } = useModel('khaothi.sinhvienthi');

	const getData = () => {
		if (sinhVienSsoId && maHocKy && maHocPhan) {
			getDiemThiHocKySinhVienModel(sinhVienSsoId, maHocKy, maHocPhan);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<SinhVienThi.IDiemThiHocKySinhVien>[] = [
		{
			title: 'Kỳ thi',
			width: 250,
			render: (val, rec) => rec?.kyThi?.ten ?? '--',
		},
		{
			title: 'HT thi',
			dataIndex: ['hocPhanThi', 'tenHinhThucThi'],
			align: 'center',
			width: 100,
		},
		{
			title: 'SBD',
			dataIndex: ['sinhVienThi', 'sbd'],
			align: 'center',
			width: 80,
		},
		{
			title: 'Trạng thái',
			dataIndex: ['sinhVienThi', 'trangThai'],
			align: 'center',
			width: 120,
		},
		{
			title: 'Điểm thi',
			dataIndex: 'diemKthp',
			align: 'center',
			width: 100,
			render: (val, rec) => (
				<>
					{rec.sinhVienThi.trangThaiDuThi && rec.sinhVienThi.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
						<span title={trangThaiDuThi[rec.sinhVienThi.trangThaiDuThi]}>{rec?.sinhVienThi?.trangThaiDuThi}</span>
					) : (
						(val ?? '--')
					)}
				</>
			),
		},
		{
			title: 'Phúc khảo',
			dataIndex: 'diemPhucKhao',
			align: 'center',
			width: 100,
		},
	];

	return (
		<TableStaticData
			addStt
			data={diemThiHocKySinhVien}
			columns={columns}
			size='small'
			loading={loading}
			otherProps={{ pagination: false, scroll: { y: 150 } }}
			onReload={getData}
			hasTotal
		/>
	);
};

export default DiemThiHocKy;
