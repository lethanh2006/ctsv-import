import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from 'umi';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhBaoHiem = () => {
	const intl = useIntl();
	return (
		<QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.BAO_HIEM} title={intl.formatMessage({ id: 'baohiem.title' })} />
	);
};

export default QuyetDinhBaoHiem;
