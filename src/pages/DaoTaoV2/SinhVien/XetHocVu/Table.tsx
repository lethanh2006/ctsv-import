import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import {
	ETrangThaiDuyetXuLyKqht,
	colorLoaiXuLyKQHT,
	loaiXuLyKQHT,
	type ELoaiXuLyKQHT,
} from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { formatDate } from '@/utils/formatDate';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const SinhVienCanhBaoTable = () => {
	const intl = useIntl();
	const { getAllModel, loading } = useModel('daotaov2.ketquahoctap.xethocvu.xuly');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [danhSach, setDanhSach] = useState<XetHocVu.IRecord[]>([]);

	const getData = () =>
		recSinhVien?.ssoId &&
		getAllModel(
			undefined,
			undefined,
			{ daChot: true, trangThai: ETrangThaiDuyetXuLyKqht.DA_DUYET },
			undefined,
			`sinh-vien/${recSinhVien.ssoId}`,
			false,
		).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, [recSinhVien?._id]);

	const columns: IColumn<XetHocVu.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.hocky' }),
			dataIndex: 'maHocKy',
			width: 150,
			render: (val, rec) => rec.hocKy?.ten,
		},
		// {
		// 	title: 'Mã SV',
		// 	dataIndex: 'maSinhVien',
		// 	width: 120,
		// 	align: 'center',
		// },
		// {
		// 	title: 'Họ tên',
		// 	dataIndex: 'hoTen',
		// 	width: 180,
		// },
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.loaixuly' }),
			dataIndex: 'loaiXuLy',
			align: 'center',
			width: 120,
			render: (val: ELoaiXuLyKQHT) =>
				val && <Tag color={colorLoaiXuLyKQHT[val]}>{intl.formatMessage({ id: loaiXuLyKQHT[val] ?? val })}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.quyetdinh' }),
			dataIndex: 'quyetDinhId',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				rec.quyetDinh?._id ? (
					<>
						{rec.quyetDinh?.soQuyetDinh}, {formatDate(rec?.quyetDinh?.ngayBanHanh)}
					</>
				) : !!val ? (
					<i>{intl.formatMessage({ id: 'sinhvien.xethocvu.status.daraquyetdinh' })}</i>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.lydo' }),
			dataIndex: 'lyDo',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.khoanganh' }),
			dataIndex: 'maKhoaNganh',
			width: 180,
			render: (val, rec) => rec?.khoaNganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.xethocvu.column.lop' }),
			dataIndex: 'tenLopHanhChinh',
			width: 100,
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={danhSach} hasTotal addStt loading={loading} />
		</>
	);
};

export default SinhVienCanhBaoTable;
