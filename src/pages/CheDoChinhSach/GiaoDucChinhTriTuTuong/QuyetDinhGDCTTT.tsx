import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhGDCTTT = () => {
	const intl = useIntl();

	return (
		<QuyetDinh
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG}
			title={intl.formatMessage({ id: 'danhgiaketqua.title' })}
		/>
	);
};

export default QuyetDinhGDCTTT;
