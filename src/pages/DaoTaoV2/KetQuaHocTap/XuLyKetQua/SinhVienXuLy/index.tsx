import { Alert, Card, Col, Row, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import CanhBaoHocTapTable from '../CanhBao';
import ModalKyLuat from '../KyLuat/Modal';

const SinhVienXuLyStep = (props: { isKetQua?: boolean }) => {
	const { isKetQua } = props;
	const intl = useIntl();
	const [activeKey, setActiveKey] = useState('1');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [viewKyLuat, setViewKyLuat] = useState<boolean>(false);
	const ngoaiThoiGianHopHoiDong =
		isKetQua === undefined && (!recHocKy?.tgHopHoiDongHvu || dayjs().isAfter(recHocKy?.tgHopHoiDongHvu, 'd'));
	const ngoaiThoiGianThongBaoKetQua =
		isKetQua === undefined && (!recHocKy?.tgTbKqHvu || dayjs().isAfter(recHocKy?.tgTbKqHvu, 'd'));

	return (
		<>
			{ngoaiThoiGianThongBaoKetQua ? (
				<Alert
					showIcon
					type='warning'
					description='Ngoài thời gian chốt kết quả xét học vụ'
					style={{ marginBottom: 18 }}
				/>
			) : (
				<>
					{ngoaiThoiGianHopHoiDong ? (
						<Alert showIcon type='warning' description='Ngoài thời gian họp hội đồng' style={{ marginBottom: 18 }} />
					) : null}

					<Row hidden={isKetQua} gutter={[12, 12]} style={{ marginBottom: 12 }}>
						<Col span={12} md={6}>
							<Card className='card-stat-small' onClick={() => setViewKyLuat(true)} style={{ cursor: 'pointer' }}>
								<span>Sinh viên kỷ luật</span>
							</Card>
						</Col>
					</Row>

					<Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
						<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.sinhvienxuly.tab1' })} />
						<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.sinhvienxuly.tab2' })} />
					</Tabs>

					{activeKey === '1' ? (
						<CanhBaoHocTapTable isKetQua={isKetQua} />
					) : (
						<CanhBaoHocTapTable isKetQua={isKetQua} isThoiHoc />
					)}
				</>
			)}

			<ModalKyLuat visible={viewKyLuat} setVisible={setViewKyLuat} />
		</>
	);
};

export default SinhVienXuLyStep;
