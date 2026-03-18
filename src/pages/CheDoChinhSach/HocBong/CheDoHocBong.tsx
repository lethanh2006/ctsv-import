import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from '@umijs/max';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoHocBong = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'chedochinhsach.title.hocbong' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.HOC_BONG}
		/>
	);
};

export default CheDoHocBong;
