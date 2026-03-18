import { ETrangThaiCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import ChuongTrinhDaoTaoPage from '.';

const BienSoanChuongTrinhPage = () => {
	const intl = useIntl();
	const [tabActive, setTabActive] = useState('1');

	return (
		<Card title={intl.formatMessage({ id: 'danhmuchethong.coso.chuongtrinhdaotao.biensoanchuongtrinhdaotao' })}>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab)}>
				<Tabs.TabPane key='1' tab='Đang biên soạn' />
				<Tabs.TabPane key='2' tab='Chờ công bố' />
			</Tabs>

			{/* <ChuongTrinhDaoTaoPage trangThai={tabActive === '1' ? ETrangThaiCtdt.BIEN_SOAN : ETrangThaiCtdt.CHO_CONG_BO} /> */}
		</Card>
	);
};

export default BienSoanChuongTrinhPage;
