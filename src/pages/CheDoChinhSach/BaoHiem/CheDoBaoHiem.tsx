import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { useIntl } from '@umijs/max';
import CheDoSinhVienComponent from '../components/TableCheDoSinhVien';

const CheDoBaoHiem = () => {
	const intl = useIntl();
	return (
		<CheDoSinhVienComponent
			title={intl.formatMessage({ id: 'chedochinhsach.title.baohiem' })}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.BAO_HIEM}
		/>
	);
};

export default CheDoBaoHiem;
