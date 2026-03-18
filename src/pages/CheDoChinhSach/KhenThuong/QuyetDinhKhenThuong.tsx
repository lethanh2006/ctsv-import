import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import QuyetDinh from '../QuyetDinh';

const CheDoChinhSach = () => {
	const intl = useIntl();

	return (
		<QuyetDinh
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG}
			title={intl.formatMessage({ id: 'khenthuong.title' })}
		/>
	);
};

export default CheDoChinhSach;
