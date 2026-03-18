import { TabViewPage } from '@/components/TabViewPage';
import type { NotificationType } from '@/services/ThongBao/constant';
import { useIntl } from '@umijs/max';
import CardThongBao from './CardThongBao';

const TabViewThongBao = (props: { notiType: NotificationType }) => {
	const intl = useIntl();
	const { notiType } = props;
	const paths = ['ban-hanh', 'tu-dong'];
	const titles = [
		intl.formatMessage({ id: 'thongbao.tabview.tbbanhanh' }),
		intl.formatMessage({ id: 'thongbao.tabview.tbtudong' }),
	];

	const menus = [
		{
			title: titles[0],
			menuKey: paths[0],
			content: <CardThongBao notiType={notiType} activeKey='ban_hanh' />,
		},
		{
			title: titles[1],
			menuKey: paths[1],
			content: <CardThongBao notiType={notiType} activeKey='tu_dong' />,
		},
	];

	return <TabViewPage hideCard menu={menus} />;
};

export default TabViewThongBao;
