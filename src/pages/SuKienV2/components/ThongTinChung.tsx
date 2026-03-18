import ViewKhaoSat from '@/pages/SuKienV2/components/ViewKhaoSat/View';
import { ETrangThaiDienRaMappingToTagColor, ETrangThaiDienRaMappingToTagLabel } from '@/services/SuKien/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { Descriptions, Divider, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useIntl, useModel } from 'umi';

interface IProps {
	data: SuKienV2.IRecord;
}

const ThongTinChung = (props: IProps) => {
	const { data } = props;
	const intl = useIntl();

	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const { danhSach: danhSachCauHinhMinhChungDRL } = useModel('diemrenluyen.minhchung.cauhinh');
	const [visibleKhaoSat, setVisibleKhaoSat] = useState<boolean>(false);

	const t = (id: string) => intl.formatMessage({ id });

	const handleViewBieuMau = async (idBieuMau: string) => {
		try {
			getBieuMau(idBieuMau).then(() => {
				setVisibleKhaoSat(true);
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label={t('sukien.chitiet.thongtin.ten')}>{data?.tenSuKien}</Descriptions.Item>
				<Descriptions.Item label={t('sukien.chitiet.thongtin.trangthai')}>
					{data?.trangThai ? (
						<Tag color={ETrangThaiDienRaMappingToTagColor[data.trangThai]}>
							{ETrangThaiDienRaMappingToTagLabel[data.trangThai]}
						</Tag>
					) : (
						'--'
					)}
				</Descriptions.Item>
				{data?.thoiGianBatDauDangKy && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.batdaudangky')}>
						{data?.thoiGianBatDauDangKy ? dayjs(data?.thoiGianBatDauDangKy).format('HH:mm DD/MM/YYYY') : '--'}
					</Descriptions.Item>
				)}
				{data?.thoiGianKetThucDangKy && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.ketthucdangky')}>
						{data?.thoiGianKetThucDangKy ? dayjs(data?.thoiGianKetThucDangKy).format('HH:mm DD/MM/YYYY') : '--'}
					</Descriptions.Item>
				)}
				<Descriptions.Item label={t('sukien.chitiet.thongtin.batdau')}>
					{data?.thoiGianBatDau ? dayjs(data?.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item label={t('sukien.chitiet.thongtin.ketthuc')}>
					{data?.thoiGianKetThuc ? dayjs(data?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
				</Descriptions.Item>
				<Descriptions.Item span={3} label={t('sukien.chitiet.thongtin.diadiem')}>
					{data?.diaDiem ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item span={3} label={t('sukien.chitiet.thongtin.diemrenluyen')}>
					{danhSachCauHinhMinhChungDRL?.find((item) => item._id === data.cauHinhMinhChungId)?.tenMinhChung ?? '--'}
				</Descriptions.Item>
				{/*<Descriptions.Item label='Kinh phí'>{data?.kinhPhi ? tienVietNam(data?.kinhPhi) : '--'}</Descriptions.Item>*/}
				{/*<Descriptions.Item label='Số lượng'>{data?.soLuong ?? data?.users?.length ?? '--'}</Descriptions.Item>*/}
				<Descriptions.Item span={6} label={t('sukien.chitiet.thongtin.ghichu')}>
					{data?.ghiChu ?? '--'}
				</Descriptions.Item>
				{/*<Descriptions.Item label='Mã hoạt động'>*/}
				{/*	<Link target='_blank' to={`/qr-su-kien/${data?._id}`}>*/}
				{/*		{data?.maSuKien}*/}
				{/*	</Link>*/}
				{/*</Descriptions.Item>*/}
				{data?.idKhaoSatDangKy && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.khaosatdangky')}>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => handleViewBieuMau(data?.idKhaoSatDangKy ?? '')}
						>
							{t('common.form')}
						</div>
					</Descriptions.Item>
				)}
				{data?.idKhaoSatCheckIn && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.khaosatcheckin')}>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => handleViewBieuMau(data?.idKhaoSatCheckIn ?? '')}
						>
							{t('common.form')}
						</div>
					</Descriptions.Item>
				)}
				{data?.idKhaoSatCheckOut && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.khaosatcheckout')}>
						<div
							style={{ color: '#0090d5', cursor: 'pointer' }}
							onClick={() => handleViewBieuMau(data?.idKhaoSatCheckOut ?? '')}
						>
							{t('common.form')}
						</div>
					</Descriptions.Item>
				)}
				{/*{data?.receiverType && (*/}
				{/*	<Descriptions.Item label='Đối tượng tham gia'>*/}
				{/*		<Space style={{ width: '100%' }} direction='vertical'>*/}
				{/*			<div>{LoaiDoiTuongThamGia[data?.receiverType]}</div>*/}
				{/*			{data?.receiverType === EReceiverType.Khoa ? (*/}
				{/*				<SelectDonVi readOnly value={data.filter?.idKhoa} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.KhoaSinhVien ? (*/}
				{/*				<SelectKhoaSinhVien disabled value={data.filter?.idKhoaSinhVien} multiple />*/}
				{/*			) : data?.receiverType === EReceiverType.LopHanhChinh ? (*/}
				{/*				<SelectLopHanhChinhDebounce disabled value={data.filter?.idLopHanhChinh} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.LopHocPhan ? (*/}
				{/*				<SelectLopHocPhanDebounce disabled value={data.filter?.idLopHocPhan} multiple selectMa />*/}
				{/*			) : data?.receiverType === EReceiverType.Nganh ? (*/}
				{/*				<SelectNganhCoSo disabled value={data.filter?.idNganh} multiple />*/}
				{/*			) : null}*/}
				{/*		</Space>*/}
				{/*	</Descriptions.Item>*/}
				{/*)}*/}
				{/*{roles?.length && (*/}
				{/*	<Descriptions.Item label='Thành phần'>*/}
				{/*		{roles.map((role) => TenVaiTroBieuMau[role]).join('; ')}*/}
				{/*	</Descriptions.Item>*/}
				{/*)}*/}
				{/*{!data?.users?.length && <Descriptions.Item label='Danh sách người tham gia'>Tất cả</Descriptions.Item>}*/}
			</Descriptions>
			<Divider />
			<Descriptions column={2}>
				{data?.isQRDangKy && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.qrdangky')}>
						{dayjs(data?.thoiGianBatDauDangKy).isAfter(dayjs()) ? (
							<Tag color='orange'>{t('sukien.trangthai.chuadangky')}</Tag>
						) : (
							<>
								{dayjs(data?.thoiGianKetThucDangKy).isBefore(dayjs()) ? (
									<Tag color={'red'}>{t('sukien.trangthai.hetdangky')}</Tag>
								) : (
									<>
										<Link target='_blank' to={`/qr-tham-gia/${data?._id}?type=Đăng ký`}>
											{t('common.qr')}
										</Link>
									</>
								)}
							</>
						)}
					</Descriptions.Item>
				)}

				{data?.isQRThamGia && (
					<Descriptions.Item label={t('sukien.chitiet.thongtin.qrthamgia')}>
						{/* {dayjs(data?.thoiGianBatDau).isAfter(dayjs()) ? (
							<Tag color={'orange'}>Chưa đến thời gian điểm danh</Tag>
						) : (
							<>
								{dayjs(data?.thoiGianKetThuc).isBefore(dayjs()) ? (
									<Tag color={'red'}>Đã hết thời gian điểm danh</Tag>
								) : ( */}
						<>
							<Link target='_blank' to={`/qr-su-kien-v2/${data?._id}?type=Điểm danh`}>
								{t('common.qr')}
							</Link>
						</>
						{/* )}
							</>
						)} */}
					</Descriptions.Item>
				)}
			</Descriptions>
			<Modal
				title={t('sukien.chitiet.khaosat')}
				open={visibleKhaoSat}
				onCancel={() => setVisibleKhaoSat(false)}
				width={800}
				footer={null}
			>
				<ViewKhaoSat hideCard onCancel={() => setVisibleKhaoSat(false)} />
			</Modal>
		</>
	);
};
export default ThongTinChung;
