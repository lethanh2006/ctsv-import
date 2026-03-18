import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import QuyetDinh from '../QuyetDinh';

const CheDoChinhSach = () => {
	const intl = useIntl();

	return (
		<QuyetDinh
			filterWidth={250}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH}
			title={intl.formatMessage({ id: 'chedochinhsach.title' })}
		/>
	);
};

export default CheDoChinhSach;
