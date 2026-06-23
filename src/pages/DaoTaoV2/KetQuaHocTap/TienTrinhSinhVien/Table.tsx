import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT, ELoaiNganhChuyenNganh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { ColorDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { Tag } from 'antd';
import { useIntl } from 'umi';

const TableTienTrinhSinhVien = (props: { data: ChuongTrinhDaoTao.THocPhanTienTrinhKhung[] }) => {
	const intl = useIntl();
	const { data } = props;
	const danhSach = data.map((hocPhan) => {
		const { hocPhanCtdtList, ...da } = hocPhan;
		return {
			children: hocPhanCtdtList?.map((hp) => ({ ...hp, ten: hp.hocPhan?.ten })),
			...da,
			ten: da.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? da.hocPhan?.ten : da.ten,
		};
	});

	const columns: IColumn<ChuongTrinhDaoTao.THocPhanTienTrinhKhung>[] = [
		{ title: intl.formatMessage({ id: 'sinhvien.detail.table.stt' }), dataIndex: 'index', align: 'center', width: 60 },
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.mahp' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.tenhp' }),
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.phanloai' }),
			width: 100,
			dataIndex: 'loaiHocPhanCtdt',
			filterType: 'select',
			filterData: Object.values(ELoaiHocPhanCTDT),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.stc' }),
			width: 60,
			align: 'center',
			render: (val, rec) => rec.hocPhan?.soTinChi ?? rec.soTinChiTuChonPhaiHoc,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.kqht' }),
			width: 100,
			align: 'center',
			render: (val, rec) =>
				rec.lichSuDiem?.length ? (
					rec.lichSuDiem.map((i) =>
						i.diemChu ? (
							<Tag key={i._id} color={ColorDiemChu[i.diemChu]}>
								{i.diemChu}
							</Tag>
						) : (
							'--'
						),
					)
				) : rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<i className='text-error'>{intl.formatMessage({ id: 'sinhvien.detail.status.chuahoc' })}</i>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.chuyennganh' }),
			width: 150,
			render: (val, rec) => {
				return (
					<div>
						{rec.chuyenNganh?.loai === ELoaiNganhChuyenNganh.CHUYEN_NGANH_PHU && (
							<Tag color='orange' style={{ marginBottom: 4 }}>
								Phụ
							</Tag>
						)}
						{rec.chuyenNganh?.ten}
					</div>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.detail.table.khoikienthuc' }),
			width: 150,
			render: (val, rec) => rec.khoiKienThuc?.ten,
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={danhSach} size='small' />
		</>
	);
};

export default TableTienTrinhSinhVien;
