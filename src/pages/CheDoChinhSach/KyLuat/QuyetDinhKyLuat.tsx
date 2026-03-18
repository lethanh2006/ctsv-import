import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from '@umijs/max';
import QuyetDinh from '../QuyetDinh';

const CheDoChinhSach = () => {
	const intl = useIntl();
	return (
		<QuyetDinh
			filterWidth={200}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT}
			title={intl.formatMessage({ id: 'kyluatkhenthuong.kyluat.title' })}
		/>
	);
};

export default CheDoChinhSach;
