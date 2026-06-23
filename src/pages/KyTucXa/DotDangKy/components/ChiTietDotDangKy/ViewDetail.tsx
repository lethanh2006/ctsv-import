import { CalendarOutlined } from '@ant-design/icons';
import { useIntl, useModel } from '@umijs/max';
import { Card, Col, Row, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { ELoaiDotDangKyKTX } from '@/services/KyTucXa/constant';
import ThongKe from './ThongKe';
import DanhSachSinhVien from './DanhSachSinhVien';

const getTrangThaiDot = (record: any, t: any) => {
	const now = dayjs();
	const thoiGianBatDau = record?.thoiGianBatDau ? dayjs(record.thoiGianBatDau) : undefined;
	const thoiGianKetThuc = record?.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc) : undefined;

	if (thoiGianKetThuc && now.isAfter(thoiGianKetThuc))
		return { label: t('kytucxa.dotdangky.status.ended') || 'Đã kết thúc', color: 'default', textStyle: { color: '#8c8c8c' } };
	if (thoiGianBatDau && thoiGianKetThuc && !now.isBefore(thoiGianBatDau) && !now.isAfter(thoiGianKetThuc)) {
		return { label: t('kytucxa.dotdangky.status.ongoing') || 'Đang diễn ra', color: 'success', textStyle: { color: '#52c41a', fontWeight: 'bold' } };
	}

	return { label: t('kytucxa.dotdangky.status.upcoming') || 'Chưa diễn ra', color: 'processing', textStyle: { color: '#1890ff', fontWeight: 'bold' } };
};

const ViewDetail = () => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { record } = useModel('kytucxa.dotdangkyktx');
	const { record: recHocKy, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const { danhSach: allKhoaSinhVien, getAllModel: getAllKhoaSinhVien } = useModel('daotaov2.namhoc.khoasinhvien');

	useEffect(() => {
		getAllKhoaSinhVien(undefined, { namHocBatDau: -1 });
	}, []);

	const trangThai = getTrangThaiDot(record, t);

	const hocKyDoc = danhSachHocKy?.find((item) => item.ma === record?.maHocKy) || recHocKy;
	const hocKyLabel = hocKyDoc?.ten || record?.maHocKy || '--';


	const listKhoaSv = record?.cauHinhKhoaToa?.map((item: any) => item.maKhoaSinhVien) || record?.maKhoaNganh || [];

	const doiTuongApDung = record?.loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH
		? t('kytucxa.dotdangky.loaiDot.theoDanhSach') || 'Theo danh sách'
		: listKhoaSv.map((ma: string) => {
			const khoaSv = allKhoaSinhVien.find((item) => item.ma === ma);
			return khoaSv?.ten || ma;
		}).join(', ') || '--';

	return (
		<>

			<Card
				style={{
					borderRadius: 12,
					border: '1px solid #f0f0f0',
					boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
					marginBottom: 20,
				}}
				bodyStyle={{ padding: '24px' }}
			>
				<Row align="top" gutter={[20, 16]} wrap={false}>
					<Col flex="none">
						<div
							style={{
								width: 56,
								height: 56,
								borderRadius: '50%',
								backgroundColor: '#e6f7ff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
						</div>
					</Col>
					<Col flex="auto">
						<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
							<span style={{ fontSize: 18, fontWeight: 600, color: '#1d2129' }}>
								{record?.tenDot || '--'}
							</span>
							<Tag color={trangThai.color} style={{ margin: 0 }}>
								{trangThai.label}
							</Tag>
						</div>

						<Row gutter={[16, 16]}>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.hocKy') || 'Học kỳ'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{hocKyLabel}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.loaiDot') || 'Loại đợt'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{record?.loaiDot === ELoaiDotDangKyKTX.THEO_KHOA
										? t('kytucxa.dotdangky.loaiDot.theoKhoa') || 'Theo khóa'
										: record?.loaiDot === ELoaiDotDangKyKTX.THEO_DANH_SACH
											? t('kytucxa.dotdangky.loaiDot.theoDanhSach') || 'Theo danh sách'
											: record?.loaiDot || '--'}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.doiTuongApDung') || 'Đối tượng áp dụng'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{doiTuongApDung}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.thoiGianBatDau') || 'Ngày bắt đầu đăng ký'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{record?.thoiGianBatDau ? dayjs(record.thoiGianBatDau).format('DD/MM/YYYY HH:mm') : '--'}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.thoiGianKetThuc') || 'Ngày kết thúc đăng ký'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{record?.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc).format('DD/MM/YYYY HH:mm') : '--'}
								</div>
							</Col>
						</Row>

						<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.ngayChuyenVao') || 'Ngày chuyển vào'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{record?.ngayChuyenVao ? dayjs(record.ngayChuyenVao).format('DD/MM/YYYY') : '--'}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.ngayChuyenRa') || 'Ngày chuyển ra'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
									{record?.ngayChuyenRa ? dayjs(record.ngayChuyenRa).format('DD/MM/YYYY') : '--'}
								</div>
							</Col>
							<Col xs={24} sm={12} md={4} style={{ width: '20%', flex: '0 0 20%', maxWidth: '20%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.trangThaiDot') || 'Trạng thái đợt'}
								</div>
								<div style={{ fontSize: 14, ...trangThai.textStyle }}>
									{trangThai.label}
								</div>
							</Col>
							<Col xs={24} sm={24} md={8} style={{ width: '40%', flex: '0 0 40%', maxWidth: '40%' }}>
								<div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
									{t('kytucxa.dotdangky.ghiChu') || 'Ghi chú'}
								</div>
								<div style={{ fontSize: 14, color: '#262626', fontWeight: 500, wordBreak: 'break-word' }}>
									{record?.ghiChu || '--'}
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</Card>

			<Tabs defaultActiveKey='1'>
				<Tabs.TabPane tab={t('kytucxa.dotdangky.tab.thongKe') || 'Thống kê'} key='1'>
					<ThongKe />
				</Tabs.TabPane>
				<Tabs.TabPane tab={t('kytucxa.dotdangky.tab.danhSachSinhVien') || 'Danh sách sinh viên đăng ký'} key='2'>
					<DanhSachSinhVien />
				</Tabs.TabPane>
			</Tabs>
		</>
	);
};

export default ViewDetail;
