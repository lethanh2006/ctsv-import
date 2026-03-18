import * as Crypto from 'crypto';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, useModel, useParams, useSearchParams } from 'umi';
// @ts-ignore
import { OIDCBounder } from '@/components/OIDCBounder';
import JoinDisplay from '@/pages/SuKienV2/QRCode/JoinDisplay';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import CryptoJS from 'crypto-js';
import { useAuth } from 'react-oidc-context';

const QRCodePage = () => {
	const { id } = useParams<{ id: string }>();
	const { initialState } = useModel('@@initialState');
	const isSmScreen = useMediaQuery({
		query: '(min-width: 576px)',
	});
	const [searchParams] = useSearchParams();
	const query = Object.fromEntries(searchParams);
	const { getThongTinSuKien, isLoadingThongTinSuKien, thongTinSuKien, handleGetQRSuKien, maQRSuKien } =
		useModel('sukienv2');

	const [otp, setOtp] = useState<string | undefined>(undefined);
	const [maDiemDanh, setMaDiemDanh] = useState<string | undefined>(undefined);
	const [expiredAt, setExpiredAt] = useState(dayjs().add(10, 's').toDate().toISOString());
	const auth = useAuth();
	console.log('auth in qr', auth);

	const isKetThuc =
		thongTinSuKien?.thoiGianBatDau && thongTinSuKien.thoiGianKetThuc && dayjs().isAfter(thongTinSuKien.thoiGianKetThuc);

	const getOtp = async (dis: any) => {
		let newMaDiemDanh: string | undefined = undefined;
		let newOtp: string | undefined = undefined;
		if (dis) {
			const now = Date.now() + dis; // Thời gian thực tế trên server
			const t = Math.floor(now / 10000); // 10s mới update QR 1 lần
			const attendancePrivateKey = 'VjWWf3i584Gw7gjc1OapBlGUHAjAHgn04GlL9vFht7S9MwZeP8K1vXxpIbSue9A0';

			const bytes = CryptoJS.AES.decrypt(dis, attendancePrivateKey);
			newMaDiemDanh = bytes.toString(CryptoJS.enc.Utf8);

			newOtp = Crypto.createHmac('sha1', attendancePrivateKey).update(t.toString()).digest('hex');
		}
		setMaDiemDanh(newMaDiemDanh);
		setOtp(newOtp);
	};

	useEffect(() => {
		getOtp(maQRSuKien?.hash);
	}, [maQRSuKien]);

	useEffect(() => {
		if (!id) {
			history.push('/su-kien');
		} else {
			if (query) {
				getThongTinSuKien(id);
			} else {
				history.push('/su-kien');
			}
		}
	}, [id, query?.type]);

	useEffect(() => {
		if (id && query && initialState?.currentUser?.ssoId) {
			handleGetQRSuKien(id, (query?.type ?? '') as string);
		}
	}, [id, query?.type, expiredAt, initialState?.currentUser?.ssoId]);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setExpiredAt(dayjs().add(10, 's').toDate().toISOString());
		}, 10000);

		return () => {
			window.clearInterval(interval);
		};
	}, []);

	const ngoaiThoiGian =
		thongTinSuKien &&
		(dayjs().isAfter(thongTinSuKien.thoiGianKetThuc) || dayjs().isBefore(thongTinSuKien?.thoiGianBatDau));

	const renderContent = () => {
		// if ((!isLoadingThongTinSuKien && !thongTinSuKien) || ngoaiThoiGian) {
		// 	return (
		// 		<Empty
		// 			description={
		// 				<Space direction='vertical'>
		// 					<Typography.Paragraph strong>
		// 						{ngoaiThoiGian ? 'Sự kiện chưa diễn ra hoặc đã kết thúc' : 'Hoạt động không tồn tại'}
		// 					</Typography.Paragraph>
		// 				</Space>
		// 			}
		// 		/>
		// 	);
		// }
		return (
			<OIDCBounder>
				<JoinDisplay
					// valueQR={{ maDiemDanh: maDiemDanh ?? '', idSuKien: thongTinSuKien?._id }}
					valueQR={
						maQRSuKien?.hash
							? `${tenTruongVietTatTiengAnh?.toUpperCase() ?? 'APP'}|SU_KIEN|CHECK_IN|${JSON.stringify({
									maDiemDanh: maDiemDanh ?? '',
									idSuKien: thongTinSuKien?._id,
								})}`
							: undefined
					}
					thongTinSuKien={thongTinSuKien}
					maThamGia={maDiemDanh}
					loading={isLoadingThongTinSuKien}
				/>
				{/*<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*/}
				{/*  <div*/}
				{/*    style={{*/}
				{/*      display: 'flex',*/}
				{/*      justifyContent: 'center',*/}
				{/*      flex: 1,*/}
				{/*    }}*/}
				{/*  >*/}
				{/*    <Row*/}
				{/*      gutter={[16, 16]}*/}
				{/*      style={{*/}
				{/*        width: '100%',*/}
				{/*      }}*/}
				{/*    >*/}
				{/*      <Col xs={24} sm={12} style={{ textAlign: isSmScreen ? 'right' : 'center', marginBottom: 12 }}>*/}
				{/*        <QRCodeSVG value={JSON.stringify({ maSuKien: maDiemDanh ?? '' })} size={160} />*/}
				{/*      </Col>*/}
				{/*      <Col xs={24} sm={12} style={{ padding: '0px 12px' }}>*/}
				{/*        <Typography.Text style={{ fontSize: 24, lineHeight: 1 }} strong>*/}
				{/*          {thongTinSuKien?.tenSuKien}*/}
				{/*        </Typography.Text>*/}
				{/*        {thongTinSuKien?.thoiGianBatDau && (*/}
				{/*          <div>Bắt đầu: {dayjs(thongTinSuKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</div>*/}
				{/*        )}*/}
				{/*        {thongTinSuKien?.thoiGianKetThuc && (*/}
				{/*          <p>Kết thúc: {dayjs(thongTinSuKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</p>*/}
				{/*        )}*/}
				{/*        {maDiemDanh && <p>Mã điểm danh: {maDiemDanh}</p>}*/}
				{/*        {isKetThuc ? (*/}
				{/*          <Typography.Text strong style={{ fontSize: 22, color: primaryColor }}>*/}
				{/*            Đã kết thúc*/}
				{/*          </Typography.Text>*/}
				{/*        ) : (*/}
				{/*          <Statistic.Countdown title='Thời gian còn lại' value={thongTinSuKien?.thoiGianKetThuc} />*/}
				{/*        )}*/}
				{/*      </Col>*/}
				{/*    </Row>*/}
				{/*  </div>*/}
				{/*</div>*/}
			</OIDCBounder>
		);
	};

	return <>{renderContent()}</>;
};

export default QRCodePage;
