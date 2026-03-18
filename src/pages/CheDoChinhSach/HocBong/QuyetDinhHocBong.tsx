import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhHocBong = () => {
	const intl = useIntl();

	return (
		<QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.HOC_BONG} title={intl.formatMessage({ id: 'hocbong.title' })} />
	);
};

export default QuyetDinhHocBong;
