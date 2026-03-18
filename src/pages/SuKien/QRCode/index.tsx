import { primaryColor } from '@/services/base/constant';
import { Col, Empty, Row, Space, Spin, Statistic, Typography } from 'antd';
import dayjs from 'dayjs';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, useModel, useParams } from 'umi';

const QRCodePage = () => {
	const { id } = useParams<{ id: string }>();
	const isSmScreen = useMediaQuery({
		query: '(min-width: 576px)',
	});

	const { getThongTinSuKien, isLoadingThongTinSuKien, thongTinSuKien } = useModel('sukien');

	const [expiredAt, setExpiredAt] = useState(dayjs().add('s', 10).toDate().toISOString());

	const isKetThuc =
		thongTinSuKien?.thoiGianBatDau &&
		thongTinSuKien.thoiGianKetThuc &&
		dayjs().isAfter(thongTinSuKien.thoiGianKetThuc);

	useEffect(() => {
		if (!id) {
			history.push('/su-kien');
		} else {
			getThongTinSuKien(id);
		}
	}, [id]);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setExpiredAt(dayjs().add('s', 10).toDate().toISOString());
		}, 10000);
		return () => {
			window.clearInterval(interval);
		};
	}, []);

	const renderContent = () => {
		if (!isLoadingThongTinSuKien && !thongTinSuKien?.maSuKien) {
			return (
				<Empty
					description={
						<Space direction='vertical'>
							<Typography.Paragraph strong>Hoạt động không tồn tại</Typography.Paragraph>
						</Space>
					}
				/>
			);
		}
		return (
			<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flex: 1,
					}}
				>
					<Row
						gutter={[16, 16]}
						style={{
							width: '100%',
						}}
					>
						<Col xs={24} sm={12} style={{ textAlign: isSmScreen ? 'right' : 'center', marginBottom: 12 }}>
							<QRCodeSVG value={JSON.stringify({ expiredAt, maSuKien: thongTinSuKien?.maSuKien ?? '' })} size={160} />
						</Col>
						<Col xs={24} sm={12} style={{ padding: '0px 12px' }}>
							<Typography.Text style={{ fontSize: 24, lineHeight: 1 }} strong>
								{thongTinSuKien?.tenSuKien}
							</Typography.Text>
							{thongTinSuKien?.thoiGianBatDau && (
								<div>Bắt đầu: {dayjs(thongTinSuKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</div>
							)}
							{thongTinSuKien?.thoiGianKetThuc && (
								<p>Kết thúc: {dayjs(thongTinSuKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</p>
							)}
							{isKetThuc ? (
								<Typography.Text strong style={{ fontSize: 22, color: primaryColor }}>
									Đã kết thúc
								</Typography.Text>
							) : (
								<Statistic.Countdown title='Thời gian còn lại' value={thongTinSuKien?.thoiGianKetThuc} />
							)}
						</Col>
					</Row>
				</div>
			</div>
		);
	};

	return <Spin spinning={isLoadingThongTinSuKien}>{renderContent()}</Spin>;
};

export default QRCodePage;
