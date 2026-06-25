import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiChuongTrinhDaoTao, ELoaiHocPhanCTDT } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Segmented, Spin, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import TableTienTrinhSinhVien from './Table';

const TienTrinhHocTapSinhVien = (props: { sinhVienSsoId: string; maKhoaNganh?: string }) => {
	const intl = useIntl();
	const {
		getTienTrinhKhungSinhVienModel,
		getHocTapHienTaiModel,
		record: thongTinChuongTrinh,
	} = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [danhSach, setDanhSach] = useState<ChuongTrinhDaoTao.THocPhanTienTrinhKhung[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loaiHp, setLoaiHp] = useState('all');
	const [isDaChonPathway, setIsDaChonPathway] = useState<boolean>(true);
	const [isDaChonChuyenNganh, setIsDaChonChuyenNganh] = useState<boolean>(true);
	const { sinhVienSsoId, maKhoaNganh } = props;

	useEffect(() => {
		if (sinhVienSsoId && maKhoaNganh) {
			getHocTapHienTaiModel(sinhVienSsoId, maKhoaNganh).catch((er) => console.log(er));
		}
	}, [sinhVienSsoId, maKhoaNganh]);

	useEffect(() => {
		if (sinhVienSsoId && maKhoaNganh) {
			setLoading(true);
			getTienTrinhKhungSinhVienModel(
				sinhVienSsoId,
				maKhoaNganh,
				!(thongTinChuongTrinh?.loai === ELoaiChuongTrinhDaoTao.KE_HOACH),
				isDaChonPathway,
				isDaChonChuyenNganh,
			)
				.then((tienTrinhRes) => {
					setDanhSach(tienTrinhRes);
				})
				.catch((er) => console.log(er))
				.finally(() => setLoading(false));
		}
	}, [sinhVienSsoId, maKhoaNganh, thongTinChuongTrinh?.loai, isDaChonPathway, isDaChonChuyenNganh]);

	return (
		<Spin spinning={loading}>
			<div style={{ marginBottom: 12 }}>
				<span className='fw500'>{intl.formatMessage({ id: 'sinhvien.detail.info.ctdt' })} </span>
				{thongTinChuongTrinh?.ten ?? '--'}{' '}
				<Tooltip
					title={
						<>
							{intl.formatMessage(
								{ id: 'sinhvien.detail.info.tongstc' },
								{ tinchi: thongTinChuongTrinh?.tongSoTinChi },
							)}
							<br />
							{intl.formatMessage(
								{ id: 'sinhvien.detail.info.thoigian' },
								{ nam: thongTinChuongTrinh?.thoiGianDaoTao },
							)}
							<br />
							{intl.formatMessage(
								{ id: 'sinhvien.detail.info.thoigiantoida' },
								{ nam: thongTinChuongTrinh?.thoiGianDaoTaoToiDa },
							)}
						</>
					}
				>
					<InfoCircleOutlined />
				</Tooltip>
			</div>

			<div style={{ marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
				<Segmented
					options={[
						{ value: 'all', label: intl.formatMessage({ id: 'sinhvien.detail.filter.tatca' }) },
						{ value: 'fail', label: intl.formatMessage({ id: 'sinhvien.detail.filter.chuadat' }) },
					]}
					value={loaiHp}
					onChange={(val) => setLoaiHp(val.toString())}
				/>
				<Checkbox checked={isDaChonPathway} onChange={(e) => setIsDaChonPathway(e.target.checked)}>
					{intl.formatMessage({ id: 'sinhvien.detail.filter.chipathwaydachon' })}
				</Checkbox>
				<Checkbox checked={isDaChonChuyenNganh} onChange={(e) => setIsDaChonChuyenNganh(e.target.checked)}>
					{intl.formatMessage({ id: 'sinhvien.detail.filter.chichuyenganhdangky' })}
				</Checkbox>
			</div>

			<TableTienTrinhSinhVien
				data={danhSach.filter(
					(i) =>
						(!i.maChuyenNganh || !recSinhVien?.maChuyenNganh || i.maChuyenNganh === recSinhVien.maChuyenNganh) &&
						(loaiHp === 'all' ||
							(i.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC &&
								!i.lichSuDiem?.some(
									(diem) =>
										!!diem.diemChu &&
										[
											ELoaiDiemChu.A,
											ELoaiDiemChu.A_PLUS,
											ELoaiDiemChu.B,
											ELoaiDiemChu.B_PLUS,
											ELoaiDiemChu.C,
											ELoaiDiemChu.C_PLUS,
											ELoaiDiemChu.D,
											ELoaiDiemChu.D_PLUS,
											ELoaiDiemChu.PASS,
											ELoaiDiemChu.MIEN_THI,
										].includes(diem.diemChu),
								))),
				)}
			/>
		</Spin>
	);
};

export default TienTrinhHocTapSinhVien;
