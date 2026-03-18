import { Col, Row } from 'antd';
import { useModel } from 'umi';

const TitlePrintLopTinChi = () => {
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<div className='to-print'>
			<div className='title'>LỚP TÍN CHỈ SINH VIÊN</div>

			<Row gutter={[12, 0]} style={{ fontSize: 13 }}>
				<Col span={8} push={1}>
					Mã sinh viên: <b>{recSinhVien?.ma}</b>
				</Col>
				<Col span={10}>
					Họ tên: <b>{recSinhVien?.ten}</b>
				</Col>
				<Col span={5}>
					Lớp: <b>{recSinhVien?.lopHanhChinhList?.[0]?.ten}</b>
				</Col>
			</Row>
		</div>
	);
};

export default TitlePrintLopTinChi;
