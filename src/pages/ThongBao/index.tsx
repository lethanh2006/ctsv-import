import { NotificationType } from '@/services/ThongBao/constant';
import { Card } from 'antd';
import { useIntl } from 'umi';
import TabViewThongBao from './TabViewThongBao';

const ThongBaoPage = () => {
	const intl = useIntl();
	return (
		<Card title={intl.formatMessage({ id: 'thongbao.title' })}>
			<TabViewThongBao notiType={NotificationType.ONESIGNAL} />
		</Card>
	);
};

export default ThongBaoPage;
