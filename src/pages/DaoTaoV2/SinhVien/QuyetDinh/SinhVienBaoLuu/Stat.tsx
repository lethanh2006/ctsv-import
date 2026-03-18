import {
	ETrangThaiSinhVienBaoLuu,
	colorTrangThaiSinhVienBaoLuu,
	fieldTrangThaiSinhVienBaoLuu,
} from '@/services/DaoTaoV2/SinhVien/constant';
import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatSinhVienBaoLuu = (props: { onChange: (status: ETrangThaiSinhVienBaoLuu) => void }) => {
	const { thongKeSVBaoLuu, thongKeSinhVienBaoLuuModel } = useModel('daotaov2.quyetdinh.baoluu');

	useEffect(() => {
		thongKeSinhVienBaoLuuModel();
	}, []);

	const onClickTrangThaiBaoLuu = (trangThai: ETrangThaiSinhVienBaoLuu) => () => {
		if (props.onChange) props.onChange(trangThai);
	};

	return (
		<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
			{Object.values(ETrangThaiSinhVienBaoLuu).map((item) => (
				<Col span={12} md={8} key={item}>
					<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={onClickTrangThaiBaoLuu(item)}>
						<span className='num' style={{ color: colorTrangThaiSinhVienBaoLuu[item] }}>
							{thongKeSVBaoLuu?.[fieldTrangThaiSinhVienBaoLuu[item]] ?? '--'}
						</span>
						<span>Sinh viên {item.toLocaleLowerCase()}</span>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default StatSinhVienBaoLuu;
