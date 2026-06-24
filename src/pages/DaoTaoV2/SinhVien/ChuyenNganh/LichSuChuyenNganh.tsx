import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiChuyenNganh } from '@/services/DaoTaoV2/SinhVien/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { formatDate } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const LichSuSinhVienChuyenNganh = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.sinhvien.sinhvien');
	const { getAllModel, loading } = useModel('daotaov2.sinhvien.chuyennganh');
	const [danhSach, setDanhSach] = useState<SinhVien.IChuyenNganh[]>([]);

	useEffect(() => {
		if (record?.ssoId)
			getAllModel(
				undefined,
				undefined,
				{
					sinhVienSsoIdCu: record.ssoId,
					trangThai: ETrangThaiChuyenNganh.DA_DUYET,
				},
				undefined,
				undefined,
				false,
			).then((res) => setDanhSach(res));
	}, [record?.ssoId]);

	const columns: IColumn<SinhVien.IChuyenNganh>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.quyetdinh' }),
			dataIndex: 'idQuyetDinh',
			align: 'center',
			width: 140,
			render: (val, rec) =>
				rec.quyetDinh?.soQuyetDinh ? (
					<span>
						{rec.quyetDinh?.soQuyetDinh}, {formatDate(rec.quyetDinh.ngayBanHanh)}
					</span>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.chuyentunganh' }),
			width: 160,
			render: (val, rec) => rec.lopHanhChinhCu?.nganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.lopcu' }),
			dataIndex: 'tenLopHanhChinhCu',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.chuyentoinganh' }),
			width: 160,
			render: (val, rec) => rec.lopHanhChinhMoi?.nganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.lopmoi' }),
			dataIndex: 'tenLopHanhChinhMoi',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienchuyennganh.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSach}
				loading={loading}
				addStt
				size='small'
				otherProps={{ pagination: false, scroll: { y: 350 } }}
			/>
		</>
	);
};

export default LichSuSinhVienChuyenNganh;
