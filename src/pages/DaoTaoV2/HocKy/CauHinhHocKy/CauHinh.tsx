import { Tabs } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import CauHinhHocVuPage from './CauHinhHocVu';
import CauHinhThoiGianHocKyPage from './ThoiGianHocKy';

const ThongTinCauHinhPage = () => {
	const intl = useIntl();
	const [activeTab, setActiveTab] = useState('1');
	return (
		<>
			<Tabs accessKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.thongtincauhinh.tab1' })} />
				<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.thongtincauhinh.tab2' })} />
				<Tabs.TabPane key='3' tab={intl.formatMessage({ id: 'kyhoc.cauhinhkyhoc.thongtincauhinh.tab3' })} />
			</Tabs>

			{activeTab === '1' ? (
				<CauHinhThoiGianHocKyPage />
			) : activeTab === '2' ? (
				<CauHinhHocVuPage />
			) : (
				<CauHinhHocVuPage isThoiHoc />
			)}
		</>
	);
};

export default ThongTinCauHinhPage;
