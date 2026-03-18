import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TongQuanKeHoachMoLopPage = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { thongKeNhuCau, loading, getThongKeNhuCauHPModel } = useModel('daotaov2.hocphan.decuonghphk');
	// const { record: recordKyHoc } = useModel('daotaov2.hocky.hocky');
	// const { getThongKeNhuCauHPModel, loading } = useModel('daotaov2.hocky.nhucauhocphan');
	// const nhuCauCount: number[] = Object.values(ELoaiNhuCauHocPhan).map(
	// 	(item) => thongKeNhuCau?.thongKeTheoLoaiHocPhan.find((i) => i.tenLoaiNhuCauHocPhan === item)?.soLuong ?? 0,
	// );

	useEffect(() => {
		if (recHocKy?.ma) getThongKeNhuCauHPModel(recHocKy.ma);
	}, [recHocKy?.ma]);

	return (
		<>
			<Spin spinning={loading}>
				<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							<span className='num'>
								{thongKeNhuCau?.soLuongHocPhan ? inputFormat(thongKeNhuCau.soLuongHocPhan) : '--'}
							</span>
							<span>Số học phần</span>
						</Card>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							<span className='num'>
								{thongKeNhuCau?.tongSoNhuCauDuKien ? inputFormat(thongKeNhuCau.tongSoNhuCauDuKien) : '--'}
							</span>
							<span>Số nhu cầu dự kiến</span>
						</Card>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							<span className='num'>
								{thongKeNhuCau?.soLuongLopHocPhan ? inputFormat(thongKeNhuCau.soLuongLopHocPhan) : '--'}
							</span>
							<span>Số lớp tín chỉ dự kiến</span>
						</Card>
					</Col>
				</Row>
			</Spin>

			{/* {recordKyHoc?.isToChucDangKyNhuCau ? (
				<>
					<Divider>Theo Nhu cầu đăng ký</Divider>
					<Spin spinning={loading}>
						<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
							<Col span={24} md={8}>
								<Row gutter={[12, 12]} style={{ height: '100%' }}>
									<Col span={12} md={24}>
										<Card className='tong-quan-card'>
											<div className='tong-quan-content'>
												<div className='title'>Tổng số học phần dự kiến</div>
												<CountUp
													className='sum-text'
													end={thongKeNhuCau?.soLuongHocPhan ?? 0}
													duration={1.5}
													separator='.'
												/>
											</div>
										</Card>
									</Col>
									<Col span={12} md={24}>
										<Card className='tong-quan-card'>
											<div className='tong-quan-content'>
												<div className='title'>Tổng số lớp tín chỉ dự kiến</div>
												<CountUp
													className='sum-text'
													end={thongKeNhuCau?.soLuongLopHocPhan ?? 0}
													duration={1.5}
													separator='.'
												/>
											</div>
										</Card>
									</Col>
								</Row>
							</Col>

							<Col span={24} md={16}>
								<Card className='tong-quan-card'>
									<div className='title'>Tổng số nhu cầu học tập</div>
									<DonutChart
										xAxis={Object.values(ELoaiNhuCauHocPhan)}
										yAxis={[nhuCauCount]}
										yLabel={['']}
										height={280}
										width={550}
										formatY={(val) => inputFormat(val ?? 0) + ' nhu cầu'}
										colors={ColorLoaiNhuCauHocPhan}
										showTotal
									/>
								</Card>
							</Col>
						</Row>
					</Spin>
				</>
			) : null} */}
		</>
	);
};

export default TongQuanKeHoachMoLopPage;
