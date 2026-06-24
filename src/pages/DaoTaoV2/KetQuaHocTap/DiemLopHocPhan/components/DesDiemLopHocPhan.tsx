import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ETrangThaiThi } from '@/services/DaoTaoV2/HocKy/constant';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import { Descriptions, Divider, Empty, Space, Tabs, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
// import DiemThiHocKy from '../../../KhaoThi/KyThi/DiemThiHocKy';

const DesDiemLopHocPhan = () => {
	const intl = useIntl();
	const { record: recDiem } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { danhSach: danhSachDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [hienThiDiemThi, setHienThiDiemThi] = useState<boolean>(false);

	const hasTrongSoThi =
		!!recDiem?.trongSoThi1 ||
		!!recDiem?.trongSoThi2 ||
		!!recDiem?.trongSoThi3 ||
		!!recDiem?.trongSoThi4 ||
		!!recDiem?.trongSoThi5;

	const trongSoThanhPhan = _.range(1, 11).reduce((pre, cur) => {
		const trongSo = +(recDiem?.[`trongSo${cur}` as keyof LopHocPhan.IDiemHpSvHk] ?? 0);
		return pre + trongSo;
	}, 0);
	const hasTrongSo = !!trongSoThanhPhan;
	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) =>
			!hasTrongSo || // Đề cương học phần học kỳ này ko có trọng số
			!!recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk],
	);

	useEffect(() => {
		setHienThiDiemThi(false);
	}, [recDiem?._id]);

	const renderDiem = (diem?: any) => (
		<div>
			<b>{diem ?? '--'}</b>
		</div>
	);

	const renderDiemCloThanhPhan = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length) return null;
		const gClos = _.groupBy(
			_.sortBy(recDiem.danhSachDiemChuanDauRaThanhPhan, (i) => i.maClo),
			(i) => i.field,
		);

		return (
			<>
				<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.danhgiaquatrinh' })}</Divider>
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item
								label={`${intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.baidanhgia' })} ${index + 1}`}
								key={field}
							>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			</>
		);
	};

	const renderDiemCloKthp = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThi?.length) return null;
		const diemThiClos = _.sortBy(
			recDiem.danhSachDiemChuanDauRaThi.filter((i) => i.field.includes('diemThi')),
			(i) => i.maClo,
		);
		const gClosThiLan1 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi1')),
			(i) => i.field,
		);
		const gClosThiLan2 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi2')),
			(i) => i.field,
		);

		const render = (gClos: _.Dictionary<LopHocPhan.TChiTietDiemCdr[]>) => {
			return (
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item
								label={`${intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.baidanhgia' })} ${index + 1}`}
								key={field}
							>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			);
		};

		// TODO: Hiển thị điểm chuẩn đầu ra thi cuối

		return (
			<>
				{!!Object.keys(gClosThiLan1).length && (
					<>
						<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.danhgiakthp' })}</Divider>
						{render(gClosThiLan1)}
					</>
				)}

				{!!Object.keys(gClosThiLan2).length && (
					<>
						<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.danhgiakthp_lan2' })}</Divider>
						{render(gClosThiLan2)}
					</>
				)}
			</>
		);
	};

	const renderTrungBinhClo = () => {
		if (!recDiem?.danhSachDiemMucTieuDauRa?.length) return null;
		const trungBinhClos = _.sortBy(recDiem.danhSachDiemMucTieuDauRa, (i) => i.maClo);

		return (
			<>
				<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemtrungbinh' })}</Divider>
				<Descriptions bordered>
					{trungBinhClos.map((cdr) => (
						<Descriptions.Item label={cdr.maClo} key={cdr.maClo}>
							<Space wrap>
								<span className={cdr.pass ? 'text-success' : 'text-error'}>{renderDiem(cdr.diem)}</span>
								{cdr.diemToiThieu ? <small>/{cdr.diemToiThieu}</small> : null}
							</Space>
						</Descriptions.Item>
					))}
				</Descriptions>
			</>
		);
	};

	return (
		<>
			<Tabs type='card' defaultActiveKey='1'>
				<Tabs.TabPane
					tab={
						<>
							{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemgpa' })}
							{recDiem?.diemChu === ELoaiDiemChu.F ? (
								<Tag color={'red'} style={{ marginLeft: 8 }}>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.khongdat' })}
								</Tag>
							) : recDiem?.dat === true ? (
								<Tag color={'green'} style={{ marginLeft: 8 }}>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.dat' })}
								</Tag>
							) : null}
						</>
					}
					key='1'
				>
					<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemthanhphan_dkdt' })}</Divider>
					{hasTrongSo ? (
						<Descriptions bordered>
							{dauDiemCoTrongSo?.map((item) => (
								<Descriptions.Item
									label={`${item.ten}${
										hasTrongSo ? ` (${recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}%)` : ''
									}`}
									key={item._id}
								>
									{renderDiem(recDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk])}
								</Descriptions.Item>
							))}
							<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.dieukienduthi' })}>
								<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
									{recDiem?.trangThaiThi ?? '--'}
								</span>
							</Descriptions.Item>
						</Descriptions>
					) : (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.khongcodiemthanhphan' })}
						/>
					)}

					<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemthikthp' })}</Divider>
					<Descriptions bordered>
						{!hasTrongSoThi ? (
							<>
								<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.thilan1' })}>
									{renderDiem(recDiem?.diemThi1)}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.thilan2' })}>
									{renderDiem(recDiem?.diemThi2)}
								</Descriptions.Item>
							</>
						) : (
							_.range(1, 6).map((i) => {
								const trongSoThi = recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk] as number;
								const suffix = i > 1 ? i : '';
								const diemThi1 = recDiem?.[`diemThi1${suffix}` as keyof LopHocPhan.IDiemHpSvHk];
								const diemThi2 = recDiem?.[`diemThi2${suffix}` as keyof LopHocPhan.IDiemHpSvHk];

								if (!!trongSoThi) {
									return (
										<>
											<Descriptions.Item
												label={`${intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.trongsodaudiem' })} ${i}`}
											>
												<div>{trongSoThi}%</div>
											</Descriptions.Item>
											<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.thilan1' })}>
												{renderDiem(diemThi1)}
											</Descriptions.Item>
											<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.thilan2' })}>
												{renderDiem(diemThi2)}
											</Descriptions.Item>
										</>
									);
								}
								return null;
							})
						)}

						<Descriptions.Item
							label={`${intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemcuoi' })} (${100 - trongSoThanhPhan}%)`}
						>
							{recDiem?.trangThaiDuThi && recDiem.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
								<span title={trangThaiDuThi[recDiem.trangThaiDuThi]}>{recDiem?.trangThaiDuThi}</span>
							) : (
								renderDiem(recDiem?.diemKthp)
							)}
						</Descriptions.Item>
					</Descriptions>

					{recDiem && (
						<div style={{ marginTop: 8 }}>
							{!hienThiDiemThi ? (
								<a
									onClick={(e) => {
										e.preventDefault();
										setHienThiDiemThi(true);
									}}
								>
									{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.xemchitietlichsuthi' })}
								</a>
							) : (
								<DiemThiHocKy
									sinhVienSsoId={recDiem?.sinhVienSsoId}
									maHocKy={recDiem?.maHocKy}
									maHocPhan={recDiem?.maHocPhan}
								/>
							)}
						</div>
					)}

					<Divider>{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemtongket' })}</Divider>
					<Descriptions bordered>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemhe10' })}>
							{renderDiem(recDiem?.diemTongKet)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemhe4' })}>
							{renderDiem(recDiem?.diemThang4)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemchu' })}>
							{recDiem?.diemChu ? (
								<Tag color={ColorDiemChu[recDiem.diemChu as ELoaiDiemChu]}>{recDiem.diemChu}</Tag>
							) : (
								'--'
							)}{' '}
							{recDiem?.isCongNhanQuyDoiDiem && (
								<Tooltip title={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemquydoi' })}>
									(R
									{recDiem.coTichLuyQuyDoi
										? ` - ${intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.tichluy' })}`
										: ''}
									)
								</Tooltip>
							)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.ghichu' })} span={3}>
							{recDiem?.ghiChuDiem ?? '--'}
						</Descriptions.Item>
					</Descriptions>
				</Tabs.TabPane>

				{recDiem?.danhSachDiemChuanDauRaThanhPhan?.length ||
				recDiem?.danhSachDiemChuanDauRaThi?.length ||
				recDiem?.danhSachDiemMucTieuDauRa?.length ? (
					<Tabs.TabPane
						tab={
							<>
								{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemclo' })}
								{!!recDiem.danhSachDiemMucTieuDauRa?.length && (
									<Tag
										color={recDiem?.danhSachDiemMucTieuDauRa?.every((i) => i.pass) ? 'green' : 'red'}
										style={{ marginLeft: 8 }}
									>
										{recDiem?.danhSachDiemMucTieuDauRa?.filter((i) => i.pass)?.length}/
										{recDiem.danhSachDiemMucTieuDauRa?.length}
									</Tag>
								)}
							</>
						}
						key='2'
					>
						{!!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length && renderDiemCloThanhPhan()}

						{!!recDiem?.danhSachDiemChuanDauRaThi?.length && renderDiemCloKthp()}

						{!!recDiem?.danhSachDiemMucTieuDauRa?.length && renderTrungBinhClo()}
					</Tabs.TabPane>
				) : null}
			</Tabs>
		</>
	);
};

export default DesDiemLopHocPhan;
