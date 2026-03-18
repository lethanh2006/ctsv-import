import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { useIntl } from 'umi';
import HoatDongChung from '.';

const HuongNghiepViecLam = () => {
	const intl = useIntl();
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG}
			phanLoaiCap2={EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM}
			title={intl.formatMessage({ id: 'huongnghiepvieclam.title' })}
		/>
	);
};

export default HuongNghiepViecLam;
