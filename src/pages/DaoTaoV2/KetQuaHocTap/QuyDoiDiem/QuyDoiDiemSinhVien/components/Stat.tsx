import { fieldTrangThaiSinhVienQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { ETrangThaiSinhVienDot, colorTrangThaiSinhVienDot } from '@/services/DaoTaoV2/constant';

import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatSinhVienQuyDoiDiem = (props: { setTrangThaiQuyDoiDiem: (val: any) => void }) => {
	const { setTrangThaiQuyDoiDiem } = props;
	const { thongKeSinhVienQuyDoiDiemModel, thongKe } = useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');
	const { record: recDot } = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');

	useEffect(() => {
		if (recDot?._id) {
			thongKeSinhVienQuyDoiDiemModel(recDot?._id);
		}
	}, [recDot?._id]);

	return (
		<>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				{Object.values(ETrangThaiSinhVienDot).map((item) => (
					<Col span={12} md={8} key={item}>
						<Card
							className='card-stat-small'
							style={{ cursor: 'pointer' }}
							onClick={() => setTrangThaiQuyDoiDiem(item)}
						>
							<span className='num' style={{ color: colorTrangThaiSinhVienDot[item] }}>
								{thongKe?.[fieldTrangThaiSinhVienQuyDoiDiem[item]] ?? '--'}
							</span>
							<span>Sinh viên {item.toLocaleLowerCase()}</span>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default StatSinhVienQuyDoiDiem;
