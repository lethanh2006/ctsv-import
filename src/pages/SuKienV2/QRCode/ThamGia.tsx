import { Empty, Space, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, useModel, useParams } from 'umi';
import JoinDisplay from '@/pages/SuKienV2/QRCode/JoinDisplay';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import {useAuth} from "react-oidc-context";

const QRCodePage = () => {
	const { id } = useParams<{ id: string }>();
	const isSmScreen = useMediaQuery({
		query: '(min-width: 576px)',
	});
	const query = history?.location?.query;
	const { getThongTinSuKien, isLoadingThongTinSuKien, thongTinSuKien, handleGetQRSuKien, maQRSuKien } =
		useModel('sukienv2');
  const auth=useAuth()

	const isKetThuc =
		thongTinSuKien?.thoiGianBatDau &&
		thongTinSuKien.thoiGianKetThuc &&
		dayjs().isAfter(thongTinSuKien.thoiGianKetThuc);

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
	}, [id, query]);

	useEffect(() => {
		if (id && query) {
			handleGetQRSuKien(id, 'Đăng ký');
		}
	}, [id, query,auth]);

	const ngoaiThoiGian =
		thongTinSuKien &&
		(dayjs().isAfter(thongTinSuKien.thoiGianKetThucDangKy) || dayjs().isBefore(thongTinSuKien?.thoiGianBatDauDangKy));

	const renderContent = () => {
		if ((!isLoadingThongTinSuKien && !thongTinSuKien) || ngoaiThoiGian) {
			return (
				<Empty
					description={
						<Space direction='vertical'>
							<Typography.Paragraph strong>
								{ngoaiThoiGian ? 'Sự kiện chưa diễn ra hoặc đã kết thúc' : 'Hoạt động không tồn tại'}
							</Typography.Paragraph>
						</Space>
					}
				/>
			);
		}
		return (
			<>
				<JoinDisplay
					// valueQR={{ maSuKien: maQRSuKien?.maSuKien ?? '', idSuKien: thongTinSuKien?._id,suKien:{...thongTinSuKien}}}
					valueQR={maQRSuKien?.maSuKien?`${tenTruongVietTatTiengAnh?.toUpperCase() ?? 'APP'}|SU_KIEN|THAM_GIA|${JSON.stringify({
						maSuKien: maQRSuKien?.maSuKien ?? '',
						idSuKien: thongTinSuKien?._id,
						suKien: { ...thongTinSuKien },
					})}`:undefined}
					thongTinSuKien={thongTinSuKien}
					loading={isLoadingThongTinSuKien}
					maThamGia={maQRSuKien?.maSuKien}
					isThamGia
				/>
				{/*<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*/}
				{/*  <JoinDisplay/>*/}
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
				{/*        <QRCodeSVG value={JSON.stringify({ maSuKien: maQRSuKien?.maSuKien ?? '' })} size={160} />*/}
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
			</>
		);
	};

	return <>{renderContent()}</>;
};

export default QRCodePage;
