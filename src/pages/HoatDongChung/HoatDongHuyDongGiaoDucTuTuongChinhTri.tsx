import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { useIntl } from 'umi';
import HoatDongChung from '.';

const HoatDongHuyDongGiaoDucTuTuongChinhTri = () => {
	const intl = useIntl();

	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG}
			phanLoaiCap2={EHoatDongChungType2.HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI}
			title={intl.formatMessage({ id: 'tutuongchinhtri.title' })}
		/>
	);
};

export default HoatDongHuyDongGiaoDucTuTuongChinhTri;
