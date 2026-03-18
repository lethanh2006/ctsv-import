import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoKhenThuong = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'kyluatkhenthuong.chedokhenthuong.title' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG}
		/>
	);
};

export default CheDoKhenThuong;
