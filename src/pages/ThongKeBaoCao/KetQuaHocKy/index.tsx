import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import FilterKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Filter';
import { Card } from 'antd';
import { useIntl } from 'umi';
import KetQuaHocKyTablePage from './Table';

const KetQuaHocKyPage = () => {
	const intl = useIntl();
	return (
		<Card title={intl.formatMessage({ id: 'thongkebaocao.ketquahk.title' })}>
			<FilterKhoaNganh>
				<FilterHocKy hideExpand isSetHocKy allowClear />
			</FilterKhoaNganh>

			<KetQuaHocKyTablePage />
		</Card>
	);
};

export default KetQuaHocKyPage;
