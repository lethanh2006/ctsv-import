import DonutChart from '@/components/Chart/DonutChart';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Statistic, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ThongKePage = () => {
	const { record } = useModel('noingoaitru.dotkhaibao');
	const { thongKe, thongKeNoiNgoaiTruModel } = useModel('noingoaitru.khaibao');
	const { Countdown } = Statistic;

	useEffect(() => {
		if (record?._id) thongKeNoiNgoaiTruModel(record?._id);
	}, [record?._id]);

	const checkTime = (timeStart: string, timeEnd: string) => {
		if (dayjs().isBefore(timeStart)) {
			return <Tag color={'blue'}>Đợt chưa diễn ra</Tag>;
		} else {
			if (dayjs().isAfter(timeStart) && dayjs().isBefore(timeEnd)) {
				return (
					<>
						<div>
							<Tag color={'green'}>Đợt đang diễn ra</Tag>
						</div>
						<div>
							<span>
								{dayjs(record?.thoiGianKetThuc).isAfter(dayjs()) &&
									dayjs(record?.thoiGianBatDau).isBefore(dayjs()) && (
										<div
											style={{
												display: 'flex',
											}}
										>
											<p
												style={{
													color: '#0065CA',
													marginBottom: 0,
													marginRight: 8,
													fontSize: '16px',
												}}
											>
												Còn lại:
											</p>
											<Countdown
												valueStyle={{ fontSize: 16 }}
												value={dayjs(record?.thoiGianKetThuc).unix() * 1000}
												format='D Ngày H Giờ m Phút s giây )'
											/>
										</div>
									)}
							</span>
						</div>
					</>
				);
			} else {
				return <Tag color={'red'}>Đợt đã diễn ra</Tag>;
			}
		}
	};

	return (
		<Row gutter={16}>
			<Col xs={24} xl={8}>
				<div style={{ display: 'flex', height: '100%' }}>
					<div>
						<h3 style={{ color: '#0065CA' }}>Tên đợt: {record?.tenDot}</h3>
						<div style={{ marginBottom: 16 }}>
							{checkTime(
								record?.thoiGianBatDau ? dayjs(record?.thoiGianBatDau).format('YYYY-MM-DD') : '',
								record?.thoiGianKetThuc ? dayjs(record?.thoiGianKetThuc).format('YYYY-MM-DD') : '',
							)}
						</div>
						<div>
							Tổng sinh viên trong đợt khai báo: <b>{thongKe?.total ?? 0}</b> sinh viên
						</div>
						<div>
							Số lượng sinh viên đã khai báo: <b>{thongKe?.daKhaiBao ?? 0}</b> sinh viên
						</div>
						<div>
							Số lượng sinh viên chưa khai báo: <b>{thongKe?.chuaKhaiBao}</b>
							sinh viên
						</div>
					</div>
				</div>
			</Col>
			<Col xs={24} xl={16}>
				<DonutChart
					yAxis={[[thongKe?.chuaKhaiBao ?? 0, thongKe?.dangONoiTru ?? 0, thongKe?.dangONgoaiTru ?? 0]]}
					xAxis={['Sinh viên chưa khai báo', 'Sinh viên nội trú', 'Sinh viên ngoại trú']}
					yLabel={['Số sinh viên']}
					showTotal
					formatY={(val) => `${inputFormat(val)} sv`}
					otherOptions={{ legend: { position: 'bottom' } }}
				/>
			</Col>
		</Row>
	);
};

export default ThongKePage;
