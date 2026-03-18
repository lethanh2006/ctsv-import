import { EOperatorType } from '@/components/Table/constant';
import {
	ELoaiLopHocPhan,
	ETrangThaiLopHocPhan,
	colorTrangThaiDuyetGiangDay,
	type ETrangThaiDuyetGiangDay,
} from '@/services/DaoTaoV2/HocKy/constant';
import { Card, Col, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const StatPhanCongGiangDay = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');
	const { filters, setFilters, getThongKeTrangThaiDuyetGiangDayModel, thongKeTrangThaiDuyetGiangDay } =
		useModel('daotaov2.hocky.lophocphan');
	const [soLopHocPhan, setSoLopHocPhan] = useState<number>(0);

	useEffect(() => {
		if (recHocKy?.ma)
			getThongKeTrangThaiDuyetGiangDayModel({
				loai: ELoaiLopHocPhan.CHINH,
				maHocKy: recHocKy?.ma,
				maHocPhan: recHocPhan?.maHocPhan,
				trangThaiLop: ETrangThaiLopHocPhan.MO,
			}).then((res) => {
				const sum = _.sum(Object.values(res));
				setSoLopHocPhan(sum);
			});
	}, [recHocKy?.ma, recHocPhan?.maHocPhan]);

	const filterTrangThaiDuyet = (trangThai?: ETrangThaiDuyetGiangDay) => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'trangThaiDuyetGiangDay');
		if (trangThai)
			temp?.push({
				active: true,
				field: 'trangThaiDuyetGiangDay',
				values: [trangThai],
				operator: EOperatorType.INCLUDE,
			});
		setFilters(temp);
	};

	return (
		<Row gutter={[12, 12]} style={{ marginTop: 12 }}>
			<Col span={12} md={6}>
				<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => filterTrangThaiDuyet()}>
					<span className='num'>{soLopHocPhan}</span>
					<span>Lớp tín chỉ</span>
				</Card>
			</Col>
			{thongKeTrangThaiDuyetGiangDay &&
				Object.entries(thongKeTrangThaiDuyetGiangDay).map(([trangThai, num]) => (
					<Col span={12} md={6} key={trangThai}>
						<Card
							className='card-stat-small'
							style={{ cursor: 'pointer' }}
							onClick={() => filterTrangThaiDuyet(trangThai as ETrangThaiDuyetGiangDay)}
						>
							<span
								className='num'
								style={{ color: colorTrangThaiDuyetGiangDay[trangThai as ETrangThaiDuyetGiangDay] }}
							>
								{num}
							</span>
							<span>Lớp {trangThai.toLocaleLowerCase()}</span>
						</Card>
					</Col>
				))}
		</Row>
	);
};

export default StatPhanCongGiangDay;
