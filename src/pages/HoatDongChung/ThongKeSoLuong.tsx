import {
	MapKeyColorTrangThaiThongKe,
	MapKeyLabelTrangThaiThongKe,
	type EHoatDongChungType1,
	type EHoatDongChungType2,
} from '@/services/HoatDongChung/constants';
import { Card, Col, Row } from 'antd';
import { useIntl } from 'umi';

const ThongKe = (props: {
	data: {
		chuaDienRa: number;
		daDienRa: number;
		dangDienRa: number;
		phanLoaiCap1: EHoatDongChungType1;
		phanLoaiCap2: EHoatDongChungType2;
		total: number;
	};
}) => {
	const intl = useIntl();
	const { data }: any = props;

	return (
		<Col span={24}>
			<Row gutter={[12, 12]}>
				<Col span={24} md={12} lg={6}>
					<Card styles={{ body: { padding: '8px 14px' } }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<div style={{ fontSize: 18, fontWeight: 700, color: '#007EB9' }}>{data?.total ?? 0}</div>
							<div>{intl.formatMessage({ id: 'tuansinhhoatcongdan.stat.tongso' })}</div>
						</div>
					</Card>
				</Col>
				{Object.keys(MapKeyLabelTrangThaiThongKe).map((item) => {
					return (
						<Col key={item} span={24} md={12} lg={6}>
							<Card styles={{ body: { padding: '8px 14px' } }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<div style={{ fontSize: 18, fontWeight: 700, color: MapKeyColorTrangThaiThongKe[item] }}>
										{data?.[item] ?? 0}
									</div>
									<div>{MapKeyLabelTrangThaiThongKe[item]}</div>
								</div>
							</Card>
						</Col>
					);
				})}
			</Row>
		</Col>
	);
};

export default ThongKe;
