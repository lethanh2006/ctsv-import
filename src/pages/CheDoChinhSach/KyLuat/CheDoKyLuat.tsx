import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from '@umijs/max';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoKyLuat = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'kyluatkhenthuong.kyluat' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT}
		/>
	);
};

export default CheDoKyLuat;
