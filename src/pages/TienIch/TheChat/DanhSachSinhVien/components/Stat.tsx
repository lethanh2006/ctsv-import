import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatSinhVienTheChat = () => {
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { thongKeSinhVienTheChatModel, thongKe, loadingThongKe } = useModel('tienich.thechat.ketquathechat');

	useEffect(() => {
		if (recDot?._id) thongKeSinhVienTheChatModel(recDot?._id);
	}, [recDot?._id]);

	const soBaiDanhGia = thongKe?.soBaiDanhGia ?? 0;
	const tongSv = (thongKe?.soSinhVienDaDanhGia ?? 0) + (thongKe?.soSinhVienChuaDanhGia ?? 0);
	const soSvDaDanhGia = thongKe?.soSinhVienDaDanhGia ?? 0;
	const soLuotTot = thongKe?.soLuotDanhGiaTot ?? 0;
	const soLuotDat = thongKe?.soLuotDanhGiaDat ?? 0;
	const soLuotChuaDat = thongKe?.soLuotDanhGiaChuaDat ?? 0;
	const soSvChuaDanhGia = thongKe?.soSinhVienChuaDanhGia ?? 0;
	const soSvTheHinh = thongKe?.soSinhVienDanhGiaTheHinh ?? 0;

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num text-success' style={{ color: '#4096ff' }}>
							{inputFormat(soBaiDanhGia)}
						</span>
						<span>Số bài đánh giá</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#1677ff' }}>
							{inputFormat(tongSv)}
						</span>
						<span>Tổng số sinh viên</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#52c41a' }}>
							{inputFormat(soSvDaDanhGia)}
						</span>
						<span>Số sinh viên đã đánh giá</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#722ed1' }}>
							{inputFormat(soLuotTot)}
						</span>
						<span>Số lượt đánh giá Tốt</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#13c2c2' }}>
							{inputFormat(soLuotDat)}
						</span>
						<span>Số lượt đánh giá Đạt</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#faad14' }}>
							{inputFormat(soLuotChuaDat)}
						</span>
						<span>Số lượt đánh giá Chưa đạt</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#ff4d4f' }}>
							{inputFormat(soSvChuaDanhGia)}
						</span>
						<span>Số sinh viên chưa đánh giá</span>
					</Card>
				</Col>
				<Col span={12} md={6}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: '#eb2f96' }}>
							{inputFormat(soSvTheHinh)}
						</span>
						<span>Số SV đã cập nhật chỉ số hình thể</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatSinhVienTheChat;
