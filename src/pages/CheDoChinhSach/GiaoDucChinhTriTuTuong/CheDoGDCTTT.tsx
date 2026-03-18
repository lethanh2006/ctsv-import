import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const GiaoDucChinhTriTuTuong = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'chedochinhsach.title.giaoducchinhtrituong' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG}
		/>
	);
};

export default GiaoDucChinhTriTuTuong;
