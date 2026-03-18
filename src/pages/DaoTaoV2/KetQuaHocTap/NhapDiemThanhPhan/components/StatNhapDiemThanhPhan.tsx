import { EOperatorType } from '@/components/Table/constant';
import {
	colorTrangThaiDiemLop,
	ELoaiLopHocPhan,
	ETrangThaiLopHocPhan,
	type ETrangThaiDiemLop,
} from '@/services/DaoTaoV2/HocKy/constant';
import { Card, Col, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const StatNhapDiemThanhPhan = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { filters, setFilters, getThongKeTrangThaiDiemLopModel, thongKeTrangThaiDiemLop } =
		useModel('daotaov2.hocky.lophocphan');
	const [soLopHocPhan, setSoLopHocPhan] = useState<number>(0);

	useEffect(() => {
		if (recHocKy?.ma)
			getThongKeTrangThaiDiemLopModel({
				loai: ELoaiLopHocPhan.CHINH,
				maHocKy: recHocKy?.ma,
				maHocPhan: recHocPhan?.ma,
				trangThaiLop: ETrangThaiLopHocPhan.MO,
			}).then((res) => {
				const sum = _.sum(Object.values(res));
				setSoLopHocPhan(sum);
			});
	}, [recHocKy?.ma, recHocPhan?.ma]);

	const filterTrangThaiDiem = (trangThai?: ETrangThaiDiemLop) => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'trangThaiDiemLop');
		if (trangThai)
			temp?.push({ active: true, field: 'trangThaiDiemLop', values: [trangThai], operator: EOperatorType.INCLUDE });
		setFilters(temp);
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={12} md={6}>
				<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => filterTrangThaiDiem()}>
					<span className='num'>{soLopHocPhan}</span>
					<span>Lớp tín chỉ</span>
				</Card>
			</Col>
			{thongKeTrangThaiDiemLop &&
				Object.entries(thongKeTrangThaiDiemLop).map(([trangThai, num]) => (
					<Col span={12} md={6} key={trangThai}>
						<Card
							className='card-stat-small'
							style={{ cursor: 'pointer' }}
							onClick={() => filterTrangThaiDiem(trangThai as ETrangThaiDiemLop)}
						>
							<span className='num' style={{ color: colorTrangThaiDiemLop[trangThai as ETrangThaiDiemLop] }}>
								{num}
							</span>
							<span>Lớp {trangThai.toLocaleLowerCase()}</span>
						</Card>
					</Col>
				))}
		</Row>
	);
};

export default StatNhapDiemThanhPhan;
