import { Card, Empty, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterHocKy from '../HocKy/components/FilterHocKy';
import QuyDinhSoTinChiPage from './QuyDinhSoTinChi';
import RaSoatDeCuong from './RaSoatDeCuong';
import CauHinhThoiGianHocKyPage from './ThoiGianHocKy';

const CauHinhHocKyPage = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [activeKey, setActiveKey] = useState<string>('1');

	return (
		<>
			<Card title={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.title' })}>
				<div className='table-base'>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
						<FilterHocKy isSetHocKy />
					</div>
				</div>

				{recHocKy?.ma ? (
					<>
						<Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
							<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.tab1' })} />
							<Tabs.TabPane key='3' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.tab2' })} />
							<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.tab3' })} />
						</Tabs>

						{activeKey === '1' ? (
							<RaSoatDeCuong />
						) : activeKey === '2' ? (
							<CauHinhThoiGianHocKyPage />
						) : activeKey === '3' ? (
							<QuyDinhSoTinChiPage />
						) : null}
					</>
				) : (
					<Empty description={<i>Vui lòng chọn kỳ học trước</i>} style={{ margin: '24px 12px' }} />
				)}
			</Card>
		</>
	);
};

export default CauHinhHocKyPage;
