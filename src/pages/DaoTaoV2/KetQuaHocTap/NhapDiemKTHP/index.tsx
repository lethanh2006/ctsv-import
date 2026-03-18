import { useIntl } from 'umi';
import CardDiemKTHP from './components/CardDiemKTHP';
import CardHocPhan from './components/CardHocPhan';

const DiemLopHocPhanPage = () => {
	const intl = useIntl();
	return <CardHocPhan child={CardDiemKTHP} title={intl.formatMessage({ id: 'ketquahoctap.nhapdiemKTHP.title' })} />;
};

export default DiemLopHocPhanPage;
