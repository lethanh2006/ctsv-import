import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from '@umijs/max';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoChinhSach = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'chedochinhsach.title.chinhsach' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH}
		/>
	);
};

export default CheDoChinhSach;
