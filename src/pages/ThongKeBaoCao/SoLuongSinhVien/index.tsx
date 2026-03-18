import { Card } from 'antd';

import { useIntl } from '@umijs/max';
import SoLuongSinhVienLhc from './SoLuongSinhVienLhc';

const ThongKeSoLuongSinhVienPage = () => {
	const intl = useIntl();

	return (
		<Card title={intl.formatMessage({ id: 'thongkebaocao.card.title' })}>
			<div style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'thongkebaocao.card.description' })}</div>
			<SoLuongSinhVienLhc />
		</Card>
	);
};

export default ThongKeSoLuongSinhVienPage;
