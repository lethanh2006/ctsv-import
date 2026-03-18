import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import { ETrangThaiDuyetCanhBao } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const SinhVienCanhBaoTable = (props: { isThoiHoc?: boolean }) => {
	const intl = useIntl();
	const { isThoiHoc } = props;
	const { getAllModel } = useModel(
		isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao',
	);
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [danhSach, setDanhSach] = useState<XetHocVu.IRecord[]>([]);

	const getData = () =>
		recSinhVien?.ssoId &&
		getAllModel(
			undefined,
			undefined,
			{ daChot: true, trangThai: ETrangThaiDuyetCanhBao.DA_DUYET },
			undefined,
			`sinh-vien/${recSinhVien.ssoId}`,
			false,
		).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, [recSinhVien?._id]);

	const columns: IColumn<XetHocVu.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.canhbao.column.hocky' }),
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
			title: intl.formatMessage({ id: 'sinhvienhocvu.canhbao.column.lophanhchinh' }),
			dataIndex: 'tenLopHanhChinh',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.canhbao.column.lydo' }),
			dataIndex: 'danhSachLyDo',
			width: 350,
			render: (val, rec) => rec.danhSachLyDo?.map((item) => <div key={item._id}>- {item?.noiDung}</div>),
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.canhbao.column.loai' }),
			dataIndex: 'loaiThoiHoc',
			width: 120,
			hide: !isThoiHoc,
		},
	];

	return (
		<TableStaticData columns={columns} data={danhSach} otherProps={{ create: false, filter: true }} hasTotal addStt />
	);
};

export default SinhVienCanhBaoTable;
