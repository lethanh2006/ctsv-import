import DonutChart from '@/components/Chart/DonutChart';
import { useModel } from '@umijs/max';
import { Card, Col, Row, Statistic, Spin } from 'antd';
import { useEffect, useState } from 'react';

const ThongKe = () => {
	const { record: recordDot } = useModel('kytucxa.dotdangkyktx');
	const { getThongKeDotChiTiet } = useModel('kytucxa.thongkektx');

	const [loading, setLoading] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState({
		phongChoThue: 0,
		tongSucChua: 0,
		conTrong: 0,
		daDangKy: 0,
		chuaDangKy: 0,
	});

	useEffect(() => {
		const fetchData = async () => {
			if (!recordDot?._id) return;
			setLoading(true);
			try {
				const resChiTiet = await getThongKeDotChiTiet({ maDotId: recordDot._id });
				if (resChiTiet?.data?.success) {
					const thongTinPhong = resChiTiet.data.data?.thongTinPhong || {};
					const thongTinSinhVien = resChiTiet.data.data?.thongTinSinhVien || {};
					setDataThongKe({
						phongChoThue: thongTinPhong.soLuongPhongChoThue ?? 0,
						tongSucChua: thongTinPhong.tongSucChua ?? 0,
						conTrong: thongTinPhong.soLuongChoConTrong ?? 0,
						daDangKy: thongTinSinhVien.soLuongSinhVienDaDangKy ?? 0,
						chuaDangKy: thongTinSinhVien.soLuongSinhVienChuaDangKy ?? 0,
					});
				}
			} catch (e) {
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [recordDot?._id]);

	const totalDangKy = dataThongKe.daDangKy + dataThongKe.chuaDangKy;
	const tyLeDangKy = totalDangKy > 0 ? ((dataThongKe.daDangKy / totalDangKy) * 100).toFixed(1) : '0';

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Card
								bordered={false}
								style={{
									borderRadius: 8,
									border: '1px solid #f0f0f0',
									boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
								}}
								bodyStyle={{ padding: '16px 20px' }}
							>
								<Statistic
									title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Phòng cho thuê</span>}
									value={dataThongKe.phongChoThue}
									valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
								/>
							</Card>
						</Col>
						<Col span={24}>
							<Card
								bordered={false}
								style={{
									borderRadius: 8,
									border: '1px solid #f0f0f0',
									boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
								}}
								bodyStyle={{ padding: '16px 20px' }}
							>
								<Statistic
									title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Tổng sức chứa</span>}
									value={dataThongKe.tongSucChua}
									valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
								/>
							</Card>
						</Col>
						<Col span={24}>
							<Card
								bordered={false}
								style={{
									borderRadius: 8,
									border: '1px solid #f0f0f0',
									boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
								}}
								bodyStyle={{ padding: '16px 20px' }}
							>
								<Statistic
									title={<span style={{ fontSize: 14, color: '#595959', fontWeight: 500 }}>Còn trống</span>}
									value={dataThongKe.conTrong}
									valueStyle={{ fontSize: 24, color: '#1f1f1f', fontWeight: 600 }}
								/>
							</Card>
						</Col>
					</Row>
				</Col>

				<Col xs={24} md={16}>
					<Card
						bordered={false}
						style={{
							borderRadius: 8,
							border: '1px solid #f0f0f0',
							boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
							height: '100%',
						}}
						bodyStyle={{ padding: '24px 24px', height: '100%' }}
					>
						<h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f', marginBottom: 24 }}>
							Tỷ lệ đăng ký
						</h3>
						<Row align="middle" style={{ height: 'calc(100% - 48px)' }}>
							<Col xs={24} sm={10}>
								<div style={{ marginBottom: 24 }}>
									<div style={{ fontSize: 14, color: '#1890ff', fontWeight: 500, marginBottom: 8 }}>
										Đã đăng ký
									</div>
									<div style={{ fontSize: 28, color: '#1890ff', fontWeight: 700 }}>
										{dataThongKe.daDangKy.toLocaleString()}
									</div>
								</div>
								<div>
									<div style={{ fontSize: 14, color: '#fa8c16', fontWeight: 500, marginBottom: 8 }}>
										Chưa đăng ký
									</div>
									<div style={{ fontSize: 28, color: '#fa8c16', fontWeight: 700 }}>
										{dataThongKe.chuaDangKy.toLocaleString()}
									</div>
								</div>
							</Col>
							<Col xs={24} sm={14} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								<div style={{ width: '100%', maxWidth: 280, position: 'relative' }}>
									<DonutChart
										xAxis={['Đã đăng ký', 'Chưa đăng ký']}
										yAxis={dataThongKe.daDangKy === 0 && dataThongKe.chuaDangKy === 0 ? [[0, 1]] : [[dataThongKe.daDangKy, dataThongKe.chuaDangKy]]}
										yLabel={['Số lượng']}
										height={240}
										colors={['#1890ff', '#e6f7ff']}
										showTotal={true}
										otherOptions={{
											legend: { show: false },
											tooltip: {
												y: {
													formatter: (val: number) => {
														if (dataThongKe.daDangKy === 0 && dataThongKe.chuaDangKy === 0) {
															return '0';
														}
														return val !== undefined && val !== null ? val.toLocaleString() : '0';
													}
												}
											},
											plotOptions: {
												pie: {
													donut: {
														size: '75%',
														labels: {
															show: true,
															name: {
																show: true,
																fontSize: '12px',
																color: '#8c8c8c',
																offsetY: 24,
															},
															value: {
																show: true,
																fontSize: '28px',
																fontWeight: 'bold',
																color: '#1890ff',
																offsetY: -10,
																formatter: (val: any) => {
																	if (dataThongKe.daDangKy === 0 && dataThongKe.chuaDangKy === 0) {
																		return '0';
																	}
																	return val !== undefined && val !== null ? String(val.toLocaleString()) : '0';
																},
															},
															total: {
																show: true,
																showAlways: true,
																label: 'Tỷ lệ đăng ký',
																formatter: () => `${tyLeDangKy}%`,
															},
														},
													},
												},
											},
										}}
									/>
								</div>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default ThongKe;
