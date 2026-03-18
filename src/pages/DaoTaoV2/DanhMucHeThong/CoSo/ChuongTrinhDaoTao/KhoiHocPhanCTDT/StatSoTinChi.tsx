import { soTinChiHocKyMax, soTinChiHocKyMin } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Alert, Col, Descriptions } from 'antd';

export type TSoTinChiCTDT = {
	tongTinChi: number;
	tinChiChuyenNganh: number;
	// tinChiTuChon: number;
	soHocPhan: number;
	lechSoTinChiChuyenNganh?: boolean;
	hocKySoTinChi?: { hocKy: number; soTinChi: number }[];
};

const StatSoTinChi = (props: { thongKe?: TSoTinChiCTDT }) => {
	const { thongKe } = props;
	// (ko tính học kỳ cuối)
	const hocKyCanhBaoSoTinChi = thongKe?.hocKySoTinChi
		?.slice(0, -1)
		?.filter((item) => item.soTinChi < soTinChiHocKyMin || item.soTinChi > soTinChiHocKyMax);

	return (
		<>
			{thongKe?.lechSoTinChiChuyenNganh ? (
				<Col span={24}>
					<Alert
						description='Tổng số tín chỉ giữa các chuyên ngành đang không đồng nhất, vui lòng kiểm tra lại!'
						showIcon
						type='warning'
					/>
				</Col>
			) : null}

			{hocKyCanhBaoSoTinChi?.length && soTinChiHocKyMin !== undefined && soTinChiHocKyMax ? (
				<Col span={24}>
					<Alert
						description={
							<>
								Số tín chỉ học phần tích lũy của (các) học kỳ{' '}
								<span className='fw500'>{hocKyCanhBaoSoTinChi.map((item) => item.hocKy).join(', ')}</span> không nằm
								trong khoảng{' '}
								<span className='fw500'>
									{soTinChiHocKyMin} - {soTinChiHocKyMax}
								</span>
							</>
						}
						showIcon
						type='warning'
					/>
				</Col>
			) : null}

			<Col span={24}>
				<Descriptions column={{ xs: 1, sm: 1, md: 3 }}>
					<Descriptions.Item label='Tổng số học phần'>{thongKe?.soHocPhan ?? 0} học phần</Descriptions.Item>
					<Descriptions.Item label='Tổng số tín chỉ'>{thongKe?.tongTinChi ?? 0} tín</Descriptions.Item>
					<Descriptions.Item label='Số tín chỉ chuyên ngành'>{thongKe?.tinChiChuyenNganh ?? 0} tín</Descriptions.Item>
					{/* <Descriptions.Item label='Số tín chỉ tự chọn'>{thongKe?.tinChiTuChon ?? 0} tín</Descriptions.Item> */}
				</Descriptions>
			</Col>
		</>
	);
};

export default StatSoTinChi;
