import { Card, Empty, Space, Tabs } from 'antd';
import { useIntl, useModel } from 'umi';
import FilterHocKy from '../HocKy/components/FilterHocKy';
import RaSoatHocPhanPage from './RaSoatHocPhan';
import TongQuanKeHoachMoLopPage from './TongQuan';
import YKienHocPhanPage from './YKienHocPhan';
import { useState } from 'react';
import NhuCauSinhVienPage from './DangKyNhuCauSinhVien';

const KeHoachMoLopPage = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [tabActive, setTabActive] = useState<string>('1');

	return (
		<>
			<Card title={intl.formatMessage({ id: 'kyhoc.rasoathocphan.title' })}>
				<Space wrap style={{ marginBottom: 18 }}>
					<FilterHocKy isSetHocKy />
				</Space>

				{recHocKy?.ma ? (
					<>
						<TongQuanKeHoachMoLopPage />

						<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab)}>
							{/* <Tabs.TabPane key='3' tab='Đăng ký nhu cầu' /> */}
							<Tabs.TabPane key='1' tab='Nhu cầu học phần' />
							<Tabs.TabPane key='2' tab='Ý kiến phòng ban' />
						</Tabs>

						{tabActive === '3' ? (
							<NhuCauSinhVienPage />
						) : tabActive === '1' ? (
							<RaSoatHocPhanPage />
						) : (
							<YKienHocPhanPage />
						)}
					</>
				) : (
					<Empty description={<i>Vui lòng chọn kỳ học trước</i>} style={{ margin: '24px 12px' }} />
				)}
			</Card>
		</>
	);
};

export default KeHoachMoLopPage;
