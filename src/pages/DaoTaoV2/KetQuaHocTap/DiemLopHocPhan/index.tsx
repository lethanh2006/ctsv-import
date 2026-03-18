import { useIntl } from 'umi';
import CardHocPhan from '../NhapDiemKTHP/components/CardHocPhan';
import CardDiemLopHocPhan from './components/CardDiemLopHocPhan';

const DiemLopHocPhanPage = () => {
	const intl = useIntl();
	return (
		<CardHocPhan
			child={CardDiemLopHocPhan}
			hideTrangThai
			title={intl.formatMessage({ id: 'ketquahoctap.diemlophocphan.title' })}
		/>
	);
};

export default DiemLopHocPhanPage;
