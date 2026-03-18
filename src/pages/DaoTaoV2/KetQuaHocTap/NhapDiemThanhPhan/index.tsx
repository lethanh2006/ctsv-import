import { useIntl } from 'umi';
import CardLopHocPhan from '../DiemLopHocPhan/components/CardLopHocPhan';
import CardDiemThanhPhan from './components/CardDiemThanhPhan';
import StatNhapDiemThanhPhan from './components/StatNhapDiemThanhPhan';

const DiemThanhPhanPage = () => {
	const intl = useIntl();
	return (
		<CardLopHocPhan
			child={CardDiemThanhPhan}
			title={intl.formatMessage({ id: 'ketquahoctap.nhapdiemthanhphan.title' })}
			statistics={StatNhapDiemThanhPhan}
		/>
	);
};

export default DiemThanhPhanPage;
