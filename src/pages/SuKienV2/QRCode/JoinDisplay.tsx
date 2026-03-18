import { useWindowSize } from '@/hooks/useWindowSize';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import { Spin, Statistic } from 'antd';
import dayjs from 'dayjs';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';
interface IProps {
	valueQR: any;
	thongTinSuKien: SuKienV2.ThongTinSukien | undefined;
	maThamGia?: string;
	loading?: boolean;
	isThamGia?: boolean;
}

const JoinDisplayWrapper = styled.div`
	.image {
		height: 50vh;
	}

	.nen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(26, 26, 26, 0.2);
	}

	.QR {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
		align-items: center;
		justify-content: center;
		width: 100%;

		.QR-bg {
			display: inline-block;
			padding: 20px;
			background-color: #fff;
		}
	}

	.thong-tin {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 50vh;
		padding: 20px 40px;
		background-color: #f6f6f6;

		h3 {
			font-size: 24px;
		}
	}

	.calender {
		display: none;
		width: 150px;
		height: 150px;
		overflow: hidden;
		background-color: #fff;
		border-radius: 12px;

		-webkit-box-shadow: -2px 1px 31px -9px rgba(0, 0, 0, 0.75);
		-moz-box-shadow: -2px 1px 31px -9px rgba(0, 0, 0, 0.75);
		box-shadow: -2px 1px 31px -9px rgba(0, 0, 0, 0.75);
	}

	.header-calen {
		height: 20%;
		padding: 4px 0;
		color: #fff;
		text-align: center;
		background-color: #0065ca;
	}

	.footer-calen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80%;
		color: #0065ca;
		font-size: 36px;
	}

	.maDiemDanh {
		color: #0065ca;
		font-weight: bold;
		font-size: 42px;
		text-align: center;
	}

	.time {
		display: none;
		align-items: end;
	}

	.ant-statistic-content {
		color: #fff;
		font-weight: bold;
		font-size: 36px;
	}

	.ant-statistic-title {
		color: #fff;
		font-weight: bold;
		font-size: 16px;
	}

	//md
	@media (min-width: 768px) {
	}

	//xl
	@media (min-width: 1280px) {
		.calender {
			display: block;
		}

		.QR {
			justify-content: space-between;
			width: 100%;

			padding: 20px;
		}

		.thong-tin {
			flex-direction: row;
			height: auto;
			margin-top: 40px;
		}

		.time {
			display: flex;
		}

		.image {
			height: auto;
		}
	}
`;

const JoinDisplay = (props: IProps) => {
	const { valueQR, thongTinSuKien, maThamGia, loading } = props;
	const size = useWindowSize();
	const renderContent = () => {
		if (
			dayjs().isBefore(
				dayjs(props?.isThamGia ? thongTinSuKien?.thoiGianBatDauDangKy : thongTinSuKien?.thoiGianBatDau),
			)
		) {
			return <div style={{ color: '#fff', fontSize: '36px', fontWeight: 'bold' }}>Sự kiện chưa bắt đầu</div>;
		} else {
			if (
				dayjs().isAfter(
					dayjs(props?.isThamGia ? thongTinSuKien?.thoiGianKetThucDangKy : thongTinSuKien?.thoiGianKetThuc),
				)
			) {
				return <div style={{ color: '#fff', fontSize: '36px', fontWeight: 'bold' }}>Sự kiện đã kết thúc</div>;
			} else {
				return (
					<Statistic.Countdown
						style={{ color: '#fff' }}
						title='Thời gian còn lại'
						value={props?.isThamGia ? thongTinSuKien?.thoiGianKetThucDangKy : thongTinSuKien?.thoiGianKetThuc}
						format='D Ngày H Giờ m Phút s Giây'
					/>
				);
			}
		}
	};

	return (
		<JoinDisplayWrapper>
			<div className={'banner'}>
				<div className='image' style={{ position: 'relative' }}>
					<img
						style={{ height: size?.width > 768 ? 800 : 'auto', width: '100%' }}
						src={
							thongTinSuKien?.anhBia ??
							'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg'
						}
					/>
					<div className='nen' />
					<div className='QR'>
						<div className='QR-bg'>
							<Spin spinning={loading}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									{valueQR ? (
										<QRCodeSVG value={valueQR} size={size?.width > 768 ? 500 : 160} />
									) : (
										<div
											style={{
												width: size?.width > 768 ? 500 : 160,
												height: size?.width > 768 ? 500 : 160,
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											Bạn không có quyền
										</div>
									)}
								</div>
								{maThamGia && <div className={'maDiemDanh'}>{maThamGia}</div>}
							</Spin>
						</div>
						<div className='time'>
							{renderContent()}
							{/*<Statistic.Countdown*/}
							{/*	style={{ color: '#fff' }}*/}
							{/*	title='Thời gian còn lại'*/}
							{/*	value={thongTinSuKien?.thoiGianKetThuc}*/}
							{/*  format="D Ngày H Giờ m Phút s Giây"*/}
							{/*/>*/}
						</div>
					</div>
				</div>
				<div className='thong-tin' style={{ gap: '20px', alignItems: 'center' }}>
					<div className='calender'>
						<div className='header-calen'>{dayjs(thongTinSuKien?.thoiGianBatDau).format('MM/YYYY')}</div>
						<div className='footer-calen'>{dayjs(thongTinSuKien?.thoiGianBatDau).date()}</div>
					</div>

					<div>
						<h3>{thongTinSuKien?.tenSuKien}</h3>
						<div>Thời gian bắt đầu: {dayjs(thongTinSuKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</div>
						<div>Thời gian kết thúc: {dayjs(thongTinSuKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</div>
						<div>Địa điểm: {thongTinSuKien?.diaDiem}</div>
					</div>
				</div>
			</div>
		</JoinDisplayWrapper>
	);
};

export default JoinDisplay;
